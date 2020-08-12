"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXClient = void 0;
const events_1 = require("events");
const dgram_1 = __importDefault(require("dgram"));
const KNXConstants_1 = require("./protocol/KNXConstants");
const CEMIConstants_1 = require("./protocol/cEMI/CEMIConstants");
const CEMIFactory_1 = require("./protocol/cEMI/CEMIFactory");
const KNXProtocol_1 = require("./protocol/KNXProtocol");
const KNXConnectResponse_1 = require("./protocol/KNXConnectResponse");
const HPAI_1 = require("./protocol/HPAI");
const TunnelCRI_1 = require("./protocol/TunnelCRI");
var STATE;
(function (STATE) {
    STATE[STATE["STARTED"] = 0] = "STARTED";
    STATE[STATE["CONNECTING"] = 3] = "CONNECTING";
    STATE[STATE["CONNECTED"] = 4] = "CONNECTED";
    STATE[STATE["DISCONNECTING"] = 5] = "DISCONNECTING";
})(STATE || (STATE = {}));
var TUNNELSTATE;
(function (TUNNELSTATE) {
    TUNNELSTATE[TUNNELSTATE["READY"] = 0] = "READY";
})(TUNNELSTATE || (TUNNELSTATE = {}));
const SocketEvents = {
    error: 'error',
    message: 'message'
};
var KNXClientEvents;
(function (KNXClientEvents) {
    KNXClientEvents["error"] = "error";
    KNXClientEvents["disconnected"] = "disconnected";
    KNXClientEvents["discover"] = "discover";
    KNXClientEvents["indication"] = "indication";
    KNXClientEvents["connected"] = "connected";
    KNXClientEvents["ready"] = "ready";
    KNXClientEvents["response"] = "response";
})(KNXClientEvents || (KNXClientEvents = {}));
class KNXClient extends events_1.EventEmitter {
    constructor() {
        super();
        this._clientTunnelSeqNumber = 0;
        this._host = null;
        this._port = null;
        this._peerHost = null;
        this._peerPort = null;
        this._timer = null;
        this._discovery_timer = null;
        this._awaitingResponseType = null;
        this._discoverySocket = null;
        this._clientSocket = dgram_1.default.createSocket('udp4');
        this._clientTunnelSeqNumber = 0;
        this._channelID = null;
        this._connectionState = STATE.STARTED;
        this._tunnelReqTimer = new Map();
        this._pendingTunnelAnswer = new Map();
        this._processInboundMessage = this._processInboundMessage.bind(this);
        this._clientSocket.on('message', this._processInboundMessage);
    }
    get channelID() {
        return this._channelID;
    }
    bindSocketPort(port) {
        try {
            this._clientSocket.bind(port, '0.0.0.0');
        }
        catch (err) {
            this.emit(KNXClient.KNXClientEvents.error, err);
        }
    }
    send(knxPacket, host, port) {
        const peerHost = host == null ? this._peerHost : host;
        const peerPort = port == null ? this._peerPort : port;
        this._clientSocket.send(knxPacket.toBuffer(), peerPort, peerHost, err => {
            if (err) {
                this.emit(KNXClient.KNXClientEvents.error, err);
            }
        });
    }
    sendWriteRequest(srcAddress, dstAddress, data, cb = null, host, port) {
        const key = dstAddress.toString();
        if (this._pendingTunnelAnswer.has(key)) {
            const err = new Error(`Requested already pending for ${key}`);
            if (cb) {
                cb(err);
            }
            this.emit(KNXClient.KNXClientEvents.error, err);
            return;
        }
        const peerHost = host == null ? this._peerHost : host;
        const peerPort = port == null ? this._peerPort : port;
        const cEMIMessage = CEMIFactory_1.CEMIFactory.newLDataRequestMessage(true, true, srcAddress, dstAddress, data);
        cEMIMessage.control.ack = 1;
        cEMIMessage.control.broadcast = 1;
        cEMIMessage.control.priority = 3;
        cEMIMessage.control.addressType = 1;
        cEMIMessage.control.hopCount = 6;
        const seqNum = this._incSeqNumber();
        const knxTunnelingRequest = KNXProtocol_1.KNXProtocol.newKNXTunnelingRequest(this._channelID, seqNum, cEMIMessage);
        this._setTimerAndCallback(knxTunnelingRequest, cb);
        this.send(knxTunnelingRequest, peerHost, peerPort);
    }
    sendReadRequest(srcAddress, dstAddress, cb = null, host, port) {
        const key = dstAddress.toString();
        if (this._pendingTunnelAnswer.has(key)) {
            const err = new Error(`Requested already pending for ${key}`);
            if (cb) {
                cb(err);
            }
            this.emit(KNXClient.KNXClientEvents.error, err);
            return;
        }
        const peerHost = host == null ? this._peerHost : host;
        const peerPort = port == null ? this._peerPort : port;
        const cEMIMessage = CEMIFactory_1.CEMIFactory.newLDataRequestMessage(false, true, srcAddress, dstAddress, null);
        cEMIMessage.control.ack = 1;
        cEMIMessage.control.broadcast = 1;
        cEMIMessage.control.priority = 3;
        cEMIMessage.control.addressType = 1;
        cEMIMessage.control.hopCount = 6;
        const seqNum = this._incSeqNumber();
        const knxTunnelingRequest = KNXProtocol_1.KNXProtocol.newKNXTunnelingRequest(this._channelID, seqNum, cEMIMessage);
        this._setTimerAndCallback(knxTunnelingRequest, cb);
        this.send(knxTunnelingRequest, peerHost, peerPort);
    }
    startDiscovery(host, port = KNXConstants_1.KNX_CONSTANTS.KNX_PORT) {
        this._host = host;
        this._port = port;
        this._bindDiscoverySocket(host, port);
        this._discovery_timer = setTimeout(() => {
            this._discovery_timer = null;
        }, 1000 * KNXConstants_1.KNX_CONSTANTS.SEARCH_TIMEOUT);
        this._sendSearchRequestMessage();
    }
    stopDiscovery() {
        if (this._discoverySocket == null || this._host == null) {
            return;
        }
        if (this._discovery_timer != null) {
            clearTimeout(this._discovery_timer);
            this._discovery_timer = null;
        }
        this._discoverySocket.close();
        this._discoverySocket = null;
    }
    getDescription(host, port) {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        this._timer = setTimeout(() => {
            this._timer = null;
        }, 1000 * KNXConstants_1.KNX_CONSTANTS.DEVICE_CONFIGURATION_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNXConstants_1.KNX_CONSTANTS.DESCRIPTION_RESPONSE;
        this._sendDescriptionRequestMessage(host, port);
    }
    openTunnelConnection(host, port, knxLayer = TunnelCRI_1.TunnelTypes.TUNNEL_LINKLAYER) {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        const timeoutError = new Error(`Connection timeout to ${host}:${port}`);
        this._timer = setTimeout(() => {
            this._timer = null;
            this.emit(KNXClient.KNXClientEvents.error, timeoutError);
        }, 1000 * KNXConstants_1.KNX_CONSTANTS.CONNECT_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNXConstants_1.KNX_CONSTANTS.CONNECT_RESPONSE;
        this._sendConnectRequestMessage(host, port, new TunnelCRI_1.TunnelCRI(knxLayer));
    }
    getConnectionStatus(host, port, channelID) {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        this._timer = setTimeout(() => {
            this._timer = null;
        }, 1000 * KNXConstants_1.KNX_CONSTANTS.CONNECTIONSTATE_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNXConstants_1.KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE;
        if (channelID == null) {
            channelID = this._channelID;
        }
        this._sendConnectionStateRequestMessage(host, port, channelID);
    }
    disconnect(host, port, channelID) {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        this._timer = setTimeout(() => {
            this._timer = null;
        }, 1000 * KNXConstants_1.KNX_CONSTANTS.CONNECT_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNXConstants_1.KNX_CONSTANTS.DISCONNECT_RESPONSE;
        this._connectionState = STATE.DISCONNECTING;
        if (channelID == null) {
            channelID = this._channelID;
        }
        this._sendDisconnectRequestMessage(host, port, channelID);
    }
    close() {
        if (this._clientSocket) {
            this._clientSocket.close();
            this._clientSocket = null;
        }
    }
    isConnected() {
        return this._connectionState === STATE.CONNECTED;
    }
    _incSeqNumber() {
        const seq = this._clientTunnelSeqNumber++;
        if (this._clientTunnelSeqNumber > 255) {
            this._clientTunnelSeqNumber = 0;
        }
        return seq;
    }
    _initDiscoverySocket() {
        if (this._discoverySocket == null) {
            throw new Error('No server socket defined');
        }
        this._discoverySocket.on(SocketEvents.error, err => {
            this.emit(KNXClient.KNXClientEvents.error, err);
        });
        this._discoverySocket.on(SocketEvents.message, this._processInboundMessage);
    }
    _handleResponse(knxTunnelingResponse) {
        const ind = knxTunnelingResponse.cEMIMessage;
        const key = this._keyFromCEMIMessage(ind);
        if (this._pendingTunnelAnswer.has(key)) {
            const { cb, timer, req } = this._pendingTunnelAnswer.get(key);
            if (ind.msgCode === CEMIConstants_1.CEMIConstants.L_DATA_CON &&
                req.cEMIMessage.npdu.action === CEMIConstants_1.CEMIConstants.GROUP_READ) {
                return;
            }
            if (timer) {
                clearTimeout(timer);
            }
            if (cb) {
                cb(null, ind.npdu.dataValue);
            }
            this._pendingTunnelAnswer.delete(key);
        }
    }
    _keyFromCEMIMessage(cEMIMessage) {
        return cEMIMessage.dstAddress.toString();
    }
    _setTimerAndCallback(knxTunnelingRequest, cb) {
        const timeoutErr = new Error(`Request ${knxTunnelingRequest.seqCounter} timed out`);
        const key = this._keyFromCEMIMessage(knxTunnelingRequest.cEMIMessage);
        this._pendingTunnelAnswer.set(key, {
            cb,
            timer: setTimeout(() => {
                this._pendingTunnelAnswer.delete(key);
                if (cb) {
                    cb(timeoutErr);
                }
                else {
                    this.emit(KNXClient.KNXClientEvents.error, timeoutErr);
                }
            }, KNXConstants_1.KNX_CONSTANTS.TUNNELING_REQUEST_TIMEOUT * 2000),
            req: knxTunnelingRequest
        });
        this._tunnelReqTimer.set(knxTunnelingRequest.seqCounter, setTimeout(() => {
            this._tunnelReqTimer.delete(knxTunnelingRequest.seqCounter);
            this._pendingTunnelAnswer.delete(key);
            if (cb) {
                cb(timeoutErr);
            }
            else {
                this.emit(KNXClient.KNXClientEvents.error, timeoutErr);
            }
        }, KNXConstants_1.KNX_CONSTANTS.TUNNELING_REQUEST_TIMEOUT * 1000));
    }
    _processInboundMessage(msg, rinfo) {
        try {
            const { knxHeader, knxMessage } = KNXProtocol_1.KNXProtocol.parseMessage(msg);
            if (knxHeader.service_type === KNXConstants_1.KNX_CONSTANTS.SEARCH_RESPONSE) {
                if (this._discovery_timer == null) {
                    return;
                }
                this.emit(KNXClient.KNXClientEvents.discover, `${rinfo.address}:${rinfo.port}`, knxHeader, knxMessage);
            }
            else if (knxHeader.service_type === KNXConstants_1.KNX_CONSTANTS.CONNECT_RESPONSE) {
                if (this._connectionState === STATE.CONNECTING) {
                    clearTimeout(this._timer);
                    this._timer = null;
                    const knxConnectResponse = knxMessage;
                    if (knxConnectResponse.status !== KNXConstants_1.ConnectionStatus.E_NO_ERROR) {
                        this._connectionState = STATE.STARTED;
                        this.emit(KNXClient.KNXClientEvents.error, KNXConnectResponse_1.KNXConnectResponse.statusToString(knxConnectResponse.status));
                        return;
                    }
                    this._connectionState = STATE.CONNECTED;
                    this._channelID = knxConnectResponse.channelID;
                    this.emit(KNXClient.KNXClientEvents.connected, `${rinfo.address}:${rinfo.port}`, this._channelID);
                }
            }
            else if (knxHeader.service_type === KNXConstants_1.KNX_CONSTANTS.DISCONNECT_RESPONSE) {
                if (this._connectionState === STATE.DISCONNECTING) {
                    this._connectionState = STATE.STARTED;
                    this._channelID = null;
                    this.emit(KNXClient.KNXClientEvents.disconnected, `${rinfo.address}:${rinfo.port}`, this._channelID);
                }
            }
            else if (knxHeader.service_type === KNXConstants_1.KNX_CONSTANTS.DISCONNECT_REQUEST) {
                this._connectionState = STATE.STARTED;
                const knxDisconnectRequest = knxMessage;
                this._sendDisconnectResponseMessage(rinfo.address, rinfo.port, knxDisconnectRequest.channelID);
                this.emit(KNXClient.KNXClientEvents.disconnected, `${rinfo.address}:${rinfo.port}`, knxHeader, knxDisconnectRequest);
            }
            else if (knxHeader.service_type === KNXConstants_1.KNX_CONSTANTS.TUNNELING_REQUEST) {
                const knxTunnelingRequest = knxMessage;
                if (knxTunnelingRequest.cEMIMessage.msgCode === CEMIConstants_1.CEMIConstants.L_DATA_IND) {
                    const ind = knxTunnelingRequest.cEMIMessage;
                    if (ind.npdu.isGroupResponse) {
                        this._handleResponse(knxTunnelingRequest);
                    }
                    else {
                        this.emit(KNXClient.KNXClientEvents.indication, ind.srcAddress, ind.dstAddress, ind.npdu);
                    }
                }
                else if (knxTunnelingRequest.cEMIMessage.msgCode === CEMIConstants_1.CEMIConstants.L_DATA_CON) {
                    this._handleResponse(knxTunnelingRequest);
                }
                const knxTunnelAck = KNXProtocol_1.KNXProtocol.newKNXTunnelingACK(knxTunnelingRequest.channelID, knxTunnelingRequest.seqCounter, KNXConstants_1.KNX_CONSTANTS.E_NO_ERROR);
                this.send(knxTunnelAck);
            }
            else if (knxHeader.service_type === KNXConstants_1.KNX_CONSTANTS.TUNNELING_ACK) {
                const knxTunnelingAck = knxMessage;
                if (this._tunnelReqTimer.has(knxTunnelingAck.seqCounter)) {
                    clearTimeout(this._tunnelReqTimer.get(knxTunnelingAck.seqCounter));
                    this._tunnelReqTimer.delete(knxTunnelingAck.seqCounter);
                }
            }
            else {
                if (knxHeader.service_type === this._awaitingResponseType) {
                    clearTimeout(this._timer);
                }
                this.emit(KNXClient.KNXClientEvents.response, `${rinfo.address}:${rinfo.port}`, knxHeader, knxMessage);
            }
        }
        catch (e) {
            this.emit(KNXClient.KNXClientEvents.error, e);
        }
    }
    _sendDescriptionRequestMessage(host, port) {
        this._clientSocket.send(KNXProtocol_1.KNXProtocol.newKNXDescriptionRequest(new HPAI_1.HPAI(this._host)).toBuffer(), port, host, err => this.emit(KNXClient.KNXClientEvents.error, err));
    }
    _sendSearchRequestMessage() {
        this._discoverySocket.send(KNXProtocol_1.KNXProtocol.newKNXSearchRequest(new HPAI_1.HPAI(this._host, this._port)).toBuffer(), KNXConstants_1.KNX_CONSTANTS.KNX_PORT, KNXConstants_1.KNX_CONSTANTS.KNX_IP, err => this.emit(KNXClient.KNXClientEvents.error, err));
    }
    _sendConnectRequestMessage(host, port, cri) {
        this._peerHost = host;
        this._peerPort = port;
        this._connectionState = STATE.CONNECTING;
        this._clientSocket.send(KNXProtocol_1.KNXProtocol.newKNXConnectRequest(cri).toBuffer(), port, host, null);
    }
    _sendConnectionStateRequestMessage(host, port, channelID) {
        this._clientSocket.send(KNXProtocol_1.KNXProtocol.newKNXConnectionStateRequest(channelID).toBuffer(), port, host, err => this.emit(KNXClient.KNXClientEvents.error, err));
    }
    _sendDisconnectRequestMessage(host, port, channelID) {
        this._connectionState = STATE.DISCONNECTING;
        this._clientSocket.send(KNXProtocol_1.KNXProtocol.newKNXDisconnectRequest(channelID).toBuffer(), port, host, err => this.emit(KNXClient.KNXClientEvents.error, err));
    }
    _sendDisconnectResponseMessage(host, port, channelID, status = KNXConstants_1.ConnectionStatus.E_NO_ERROR) {
        this._clientSocket.send(KNXProtocol_1.KNXProtocol.newKNXDisconnectResponse(channelID, status).toBuffer(), port, host, err => this.emit(KNXClient.KNXClientEvents.error, err));
    }
    _bindDiscoverySocket(host, port) {
        if (this._discoverySocket != null) {
            throw new Error('Discovery socket already binded');
        }
        this._discoverySocket = dgram_1.default.createSocket({ type: 'udp4', reuseAddr: true });
        this._initDiscoverySocket();
        this._discoverySocket.bind(port, host, () => {
            this._discoverySocket.setMulticastInterface(host);
            this._discoverySocket.setMulticastTTL(16);
            this._host = host;
            this.emit(KNXClient.KNXClientEvents.ready);
        });
    }
}
exports.KNXClient = KNXClient;
KNXClient.KNXClientEvents = KNXClientEvents;
//# sourceMappingURL=KNXClient.js.map