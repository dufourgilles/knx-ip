"use strict";
const EventEmitter = require('events').EventEmitter;
const dgram = require('dgram');
const KNXConstants = require("./protocol/KNXConstants");
const CEMIConstants = require("./protocol/cEMI/CEMIConstants");
const KNXProtocol = require("./protocol/KNXProtocol");
const CEMIFactory = require("./protocol/cEMI/CEMIFactory");

const STATE = {
    STARTED: 0,
    CONNECTING: 3,
    CONNECTED: 4,
    DISCONNECTING: 5
};

const TUNNELSTATE = {
    READY: 0,
};

class KNXClient extends EventEmitter{
    /**
     *
     */
    constructor() {
        super();
        this._host = null;
        this._port = null;
        this._peerHost = null;
        this._peerPort = null;
        this._timer = null;
        this._discovery_timer = null;
        this._awaitingResponseType = null;
        this._discoverySocket = null;
        this._clientSocket = dgram.createSocket('udp4');
        this._clientTunnelSeqNumber = 0;
        this._channelID = null;
        this._connectionState = STATE.STARTED;
        this._tunnelState = TUNNELSTATE.READY;
        this._tunnelReqTimer = new Map();
        this._pendingTunnelAnswer = new Map();
        this._processInboundMessage = this._processInboundMessage.bind(this);


        this._clientSocket.on("message", this._processInboundMessage);
    }


    /**
     *
     * @returns {null|number}
     */
    get channelID() {
        return this._channelID;
    }

    /**
     *
     * @private
     */
    _initDiscoverySocket() {
        if (this._discoverySocket == null) {
            throw new Error("No server socket defined");
        }
        this._discoverySocket.on("error", err => {
            this.emit("error", err)
        });
        this._discoverySocket.on("message", this._processInboundMessage);
    }

    /**
     *
     * @param {KNXTunnelingRequest} knxTunnelingResponse
     * @private
     */
    _handleResponse(knxTunnelingResponse) {
        /** @type {LDataInd} */
        const ind = knxTunnelingResponse.cEMIMessage;
        const key = this._keyFromCEMIMessage(ind);
        if (this._pendingTunnelAnswer.has(key)) {
            const {cb, timer, req} = this._pendingTunnelAnswer.get(key);
            if (ind.msgCode === CEMIConstants.L_DATA_CON &&
                req.cEMIMessage.npdu.action === CEMIConstants.GROUP_READ) {
                // do not clear the timer if only a confirmation of read request.
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

    /**
     *
     * @param {LDataReq} cEMIMessage
     * @returns {string}
     * @private
     */
    _keyFromCEMIMessage(cEMIMessage) {
        return cEMIMessage.dstAddress.toString();
    }

    /**
     *
     * @param {KNXTunnelingRequest} knxTunnelingRequest
     * @param {function} cb
     * @private
     */
    _setTimerAndCallback(knxTunnelingRequest, cb) {
        const timeoutErr = new Error(`Request ${knxTunnelingRequest.seqCounter} timed out`);
        const key = this._keyFromCEMIMessage(knxTunnelingRequest.cEMIMessage);
        this._pendingTunnelAnswer.set(
            key,
            {
                cb,
                timer: setTimeout(() => {
                    this._pendingTunnelAnswer.delete(key);
                    if (cb) {
                        cb(timeoutErr)
                    }
                    else {
                        this.emit("error", err);
                    }
                }, KNXConstants.TUNNELING_REQUEST_TIMEOUT * 2000),
                req: knxTunnelingRequest
            }
        );
        this._tunnelReqTimer.set(knxTunnelingRequest.seqCounter, setTimeout(() => {
            this._tunnelReqTimer.delete(knxTunnelingRequest.seqCounter);
            this._pendingTunnelAnswer.delete(key);
            const err = new Error(`Request ${knxTunnelingRequest.seqCounter} timed out`);
            if (cb) {
                cb(err)
            }
            else {
                this.emit("error", err);
            }
        }, KNXConstants.TUNNELING_REQUEST_TIMEOUT * 1000));
    }

    /**
     *
     * @param {Buffer} msg
     * @param {Object} rinfo
     * @param {string} rinfo.address
     * @param {string} rinfo.family
     * @param {number} rinfo.port
     * @param {number} rinfo.size
     * @private
     */
    _processInboundMessage(msg, rinfo) {
        try {
            const {knxHeader, knxMessage} = KNXProtocol.parseMessage(msg);
            if (knxHeader.service_type === KNXConstants.SEARCH_RESPONSE) {
                if (this._discovery_timer == null) {
                    return;
                }
                this.emit("discover", `${rinfo.address}:${rinfo.port}`, knxHeader, knxMessage);
            }
            else if (knxHeader.service_type === KNXConstants.CONNECT_RESPONSE) {
                if (this._connectionState === STATE.CONNECTING) {
                    clearTimeout(this._timer);
                    this._timer = null;
                    this._connectionState = STATE.CONNECTED;
                    /** @type {KNXConnectResponse } */
                    const knxConnectResponse = knxMessage;
                    this._channelID = knxConnectResponse.channelID;
                    this.emit("connected", `${rinfo.address}:${rinfo.port}`,this._channelID);
                }
            }
            else if (knxHeader.service_type === KNXConstants.DISCONNECT_RESPONSE) {
                if (this._connectionState === STATE.DISCONNECTING) {
                    this._connectionState = STATE.STARTED;
                    this._channelID = null;
                    this.emit("disconnected", `${rinfo.address}:${rinfo.port}`, knxHeader, knxMessage);
                }
            }
            else if (knxHeader.service_type === KNXConstants.DISCONNECT_REQUEST) {
                this._connectionState = STATE.STARTED;
                /** @type { KNXDisconnectRequest } */
                const knxDisconnectRequest = knxMessage;
                this._sendDisconnectResponseMessage(rinfo.address, rinfo.port, knxDisconnectRequest.channelID);
                this.emit("disconnected", `${rinfo.address}:${rinfo.port}`, knxHeader, knxDisconnectRequest);
            }
            else if (knxHeader.service_type === KNXConstants.TUNNELING_REQUEST) {
                /** @type {KNXTunnelingRequest} */
                const knxTunnelingRequest = knxMessage;
                if (knxTunnelingRequest.cEMIMessage.msgCode === CEMIConstants.L_DATA_IND) {
                    /** @type {LDataInd} */
                    const ind = knxTunnelingRequest.cEMIMessage;
                    if (ind.npdu.action === CEMIConstants.GROUP_RESPONSE) {
                        this._handleResponse(knxTunnelingRequest);
                    }
                    else {
                        this.emit("indication",
                            knxTunnelingRequest.cEMIMessage.srcAddress.toString(),
                            knxTunnelingRequest.cEMIMessage.dstAddress.toString(),
                            knxTunnelingRequest.cEMIMessage.npdu
                        );
                    }
                }
                else if (knxTunnelingRequest.cEMIMessage.msgCode === CEMIConstants.L_DATA_CON) {
                    this._handleResponse(knxTunnelingRequest);
                }
                const knxTunnelAck = KNXProtocol.newKNXTunnelingACK(
                    knxTunnelingRequest.channelID,
                    knxTunnelingRequest.seqCounter,
                    KNXProtocol.KNX_CONSTANTS.E_NO_ERROR
                );
                this.send(knxTunnelAck);
            }
            else if (knxHeader.service_type === KNXConstants.TUNNELING_ACK) {
                /** @type {KNXTunnelingAck} */
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
                this.emit("response", `${rinfo.address}:${rinfo.port}`, knxHeader, knxMessage);
            }
        }
        catch(e) {
            this.emit("error", e);
        }
    }

    /**
     *
     * @param {string }host
     * @param {number} port
     * @private
     */
    _sendDescriptionRequestMessage(host, port) {
        this._clientSocket.send(
            KNXProtocol.newKNXDescriptionRequest(new KNXProtocol.HPAI(this._host)).toBuffer(),
            port,
            host,
            err => this.emit("error", err)
        );
    }

    _sendSearchRequestMessage() {
        this._discoverySocket.send(
            KNXProtocol.newKNXSearchRequest(new KNXProtocol.HPAI(this._host, this._port)).toBuffer(),
            KNXConstants.KNX_PORT,
            KNXConstants.KNX_IP,
            err => this.emit("error", err)
        );
    }

    /**
     *
     * @param {string }host
     * @param {number} port
     * @param {CRI} cri
     * @private
     */
    _sendConnectRequestMessage(host, port, cri) {
        this._peerHost = host;
        this._peerPort = port;
        this._connectionState = STATE.CONNECTING;
        this._clientSocket.send(
            KNXProtocol.newKNXConnectRequest(cri).toBuffer(),
            port,
            host,
            null
        );
    }

    /**
     *
     * @param {string }host
     * @param {number} port
     * @param {number} channelID
     * @private
     */
    _sendConnectionStateRequestMessage(host, port, channelID) {
        this._clientSocket.send(
            KNXProtocol.newKNXConnectionStateRequest(channelID),
            port,
            host,
            err => this.emit("error", err)
        );
    }

    /**
     *
     * @param {string }host
     * @param {number} port
     * @param {number} channelID
     * @private
     */
    _sendDisconnectRequestMessage(host, port, channelID) {
        this._connectionState = STATE.DISCONNECTING;
        this._clientSocket.send(
            KNXProtocol.newKNXDisconnectRequest(channelID),
            port,
            host,
            err => this.emit("error", err)
        );
    }

    /**
     *
     * @param {string }host
     * @param {number} port
     * @param {number} channelID
     * @param {number} status
     * @private
     */
    _sendDisconnectResponseMessage(host, port, channelID, status = KNXConstants.E_NO_ERROR) {
        this._clientSocket.send(
            KNXProtocol.newKNXDisconnectResponse(channelID, status),
            port,
            host,
            err => this.emit("error", err)
        );
    }

    /**
     *
     * @param {string} host
     * @param {number} port
     */
    _bindDiscoverySocket(host, port) {
        if (this._discoverySocket != null) {
            throw new Error("Discovery socket already binded");
        }
        this._discoverySocket = dgram.createSocket('udp4');
        this._initDiscoverySocket();
        this._discoverySocket.bind(port, host, () => {
            this._discoverySocket.setMulticastInterface(host);
            this._discoverySocket.setMulticastTTL(16);
            this._host = host;
            this.emit("ready");
        });
    }

    /**
     *
     * @param {KNXPacket} knxPacket
     * @param {string} host=null
     * @param {number} port=null
     */
    send(knxPacket, host = null, port = null) {
        const peerHost = host == null ? this._peerHost : host;
        const peerPort = port == null ? this._peerPort : port;
        this._clientSocket.send(
            knxPacket.toBuffer(),
            peerPort,
            peerHost,
                err => {
                    if (err) {
                        this.emit("error", err);
                    }
                });
    }

    /**
     *
     * @param {KNXAddress} srcAddress
     * @param {KNXAddress} dstAddress
     * @param {Buffer} data
     * @param {string} host
     * @param {number} port
     */
    sendWriteRequest(srcAddress, dstAddress, data, cb = null, host = null, port = null) {
        const key = dstAddress.toString();
        if (this._pendingTunnelAnswer.has(key)) {
            const err = new Error(`Requested already pending for ${key}`);
            if (cb) {
                cb(err);
            }
            this.emit("error", err);
            return;
        }
        const peerHost = host == null ? this._peerHost : host;
        const peerPort = port == null ? this._peerPort : port;
        const cEMIMessage = CEMIFactory.newLDataRequestMessage(
            true,
            true,
            srcAddress,
            dstAddress,
            data
        );
        cEMIMessage.control.ack = 1;
        cEMIMessage.control.broadcast = 1;
        cEMIMessage.control.priority = 3;
        cEMIMessage.control.addressType = 1;
        cEMIMessage.control.hopCount = 6;
        const seqNum = this._clientTunnelSeqNumber++;
        const knxTunnelingRequest = KNXProtocol.newKNXTunnelingRequest(
            this._channelID,
            seqNum,
            cEMIMessage
        );
        this._setTimerAndCallback(knxTunnelingRequest, cb);
        this.send(knxTunnelingRequest, peerHost, peerPort);
    }

    /**
     *
     * @param srcAddress
     * @param dstAddress
     * @param cb
     * @param host
     * @param port
     */
    sendReadRequest(srcAddress, dstAddress, cb = null, host = null, port = null) {
        const key = dstAddress.toString();
        if (this._pendingTunnelAnswer.has(key)) {
            const err = new Error(`Requested already pending for ${key}`);
            if (cb) {
                cb(err);
            }
            this.emit("error", err);
            return;
        }
        const peerHost = host == null ? this._peerHost : host;
        const peerPort = port == null ? this._peerPort : port;
        const cEMIMessage = CEMIFactory.newLDataRequestMessage(
            false,
            true,
            srcAddress,
            dstAddress,
            null
        );
        cEMIMessage.control.ack = 1;
        cEMIMessage.control.broadcast = 1;
        cEMIMessage.control.priority = 3;
        cEMIMessage.control.addressType = 1;
        cEMIMessage.control.hopCount = 6;
        const seqNum = this._clientTunnelSeqNumber++;
        const knxTunnelingRequest = KNXProtocol.newKNXTunnelingRequest(
            this._channelID,
            seqNum,
            cEMIMessage
        );
        this._setTimerAndCallback(knxTunnelingRequest, cb);
        this.send(knxTunnelingRequest, peerHost, peerPort);
    }
    /**
     *
     * @param {string} host - listening interface ip address
     * @param {number} port=Default_KNX_port - listening port
     */
    startDiscovery(host ,port = KNXConstants.KNX_PORT) {
        this._host = host;
        this._port = port;
        this._bindDiscoverySocket(host, port);
        this._discovery_timer = setTimeout(() => {
            this._discovery_timer = null;
        }, 1000 * KNXConstants.SEARCH_TIMEOUT);
        this._sendSearchRequestMessage();
    }

    /**
     *
     */
    stopDiscovery() {
        if (this._discoverySocket == null || this._host == null) {
            return;
        }
        if (this._discovery_timer != null) {
            clearTimeout(this._discovery_timer);
            this._discovery_timer = 0;
        }
        this._discoverySocket.close();
        this._discoverySocket = null;
    }

    /**
     *
     * @param {string} host
     * @param {number} port
     */
    getDescription(host, port) {
        if (this._clientSocket == null) {
            throw new Error("No client socket defined");
        }
        this._timer = setTimeout(() => {
            this._timer = null;
        }, 1000 * KNXConstants.DEVICE_CONFIGURATION_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNXConstants.DESCRIPTION_RESPONSE;
        this._sendDescriptionRequestMessage(host, port);
    }

    /**
     *
     * @param {string} host
     * @param {number} port
     * @param {number|string} knxLayer
     */
    openTunnelConnection(host, port, knxLayer = "TUNNEL_LINKLAYER") {
        if (this._clientSocket == null) {
            throw new Error("No client socket defined");
        }
        this._timer = setTimeout(() => {
            this._timer = null;
            this.emit("error", new Error("Connection timeout"));
        }, 1000 * KNXConstants.CONNECT_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNXConstants.CONNECT_RESPONSE;
        this._sendConnectRequestMessage(host, port, new KNXProtocol.TunnelCRI(knxLayer));
    }

    /**
     *
     * @param {string} host
     * @param {number} port
     * @param {number} [channelID]
     */
    getConnectionStatus(host, port, channelID = null) {
        if (this._clientSocket == null) {
            throw new Error("No client socket defined");
        }
        this._timer = setTimeout(() => {
            this._timer = null;
        }, 1000 * KNXConstants.CONNECTIONSTATE_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNXConstants.CONNECTIONSTATE_RESPONSE;
        if (channelID == null) { channelID = this._channelID; }
        this._sendConnectionStateRequestMessage(host, port, channelID);
    }

    /**
     *
     * @param {string} host
     * @param {number} port
     * @param {number} [channelID]
     */
    disconnect(host, port, channelID = null) {
        if (this._clientSocket == null) {
            throw new Error("No client socket defined");
        }
        this._timer = setTimeout(() => {
            this._timer = null;
        }, 1000 * KNXConstants.CONNECT_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNXConstants.DISCONNECT_RESPONSE;
        this._connectionState = STATE.DISCONNECTING;
        if (channelID == null) { channelID = this._channelID; }
        this._sendDisconnectRequestMessage(host, port, channelID);
    }

    /**
     *
     */
    close() {
        if (this._clientSocket) {
            this._clientSocket.close();
            this._clientSocket = null;
        }
    }

    /**
     *
     * @returns {boolean}
     */
    isConnected() {
        return this._connectionState === STATE.CONNECTED;
    }
}

module.exports = KNXClient;
