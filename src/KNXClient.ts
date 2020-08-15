import {EventEmitter} from 'events';
import dgram from 'dgram';
import {KNX_CONSTANTS, ConnectionStatus} from './protocol/KNXConstants';
import {CEMIConstants} from './protocol/cEMI/CEMIConstants';
import {CEMIFactory} from './protocol/cEMI/CEMIFactory';
import {LDataReq} from './protocol/cEMI/LDataReq';
import { KNXTunnelingRequest } from './protocol/KNXTunnelingRequest';
import {LDataInd} from './protocol/cEMI/LDataInd';
import { KNXProtocol } from './protocol/KNXProtocol';
import {KNXConnectResponse} from './protocol/KNXConnectResponse';
import {KNXDisconnectRequest} from './protocol/KNXDisconnectRequest';
import {KNXTunnelingAck} from './protocol/KNXTunnelingAck';
import { HPAI } from './protocol/HPAI';
import { CRI } from './protocol/CRI';
import {KNXPacket} from './protocol/KNXPacket';
import {KNXDataBuffer} from './protocol/KNXDataBuffer';
import { KNXAddress } from './protocol/KNXAddress';
import { TunnelCRI, TunnelTypes } from './protocol/TunnelCRI';

enum STATE {
    STARTED = 0,
    CONNECTING = 3,
    CONNECTED = 4,
    DISCONNECTING = 5
}

interface PendingAnswer {
    cb: (e: Error, d: any) => void;
    timer: NodeJS.Timeout;
    req: KNXTunnelingRequest;
}

interface SocketInfo {
    address: string;
    family: string;
    port: number;
    size: number;
}

enum TUNNELSTATE {
    READY = 0
}

const SocketEvents = {
    error: 'error',
    message: 'message'
};

enum KNXClientEvents {
    error = 'error',
    disconnected = 'disconnected',
    discover = 'discover',
    indication = 'indication',
    connected = 'connected',
    ready = 'ready',
    response = 'response'
}

export class KNXClient extends EventEmitter {

    static  KNXClientEvents = KNXClientEvents;

    get channelID(): number {
        return this._channelID;
    }
    private _host: string;
    private _port: number;
    private _peerHost: string;
    private _peerPort: number;
    private _timer: NodeJS.Timeout;
    private _discovery_timer: NodeJS.Timeout;
    private _awaitingResponseType: number;
    private _discoverySocket: dgram.Socket;
    private _clientSocket: dgram.Socket;
    private _clientTunnelSeqNumber = 0;
    private _channelID: number;
    private _connectionState: STATE;
    private _tunnelReqTimer: Map<number, NodeJS.Timeout>;
    private _pendingTunnelAnswer: Map<string, PendingAnswer>;
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
        this._tunnelReqTimer = new Map();
        this._pendingTunnelAnswer = new Map();
        this._processInboundMessage = this._processInboundMessage.bind(this);

        this._clientSocket.on('message', this._processInboundMessage);
    }

    send(knxPacket: KNXPacket, host?: string, port?: number): void {
        const peerHost = host == null ? this._peerHost : host;
        const peerPort = port == null ? this._peerPort : port;
        this._clientSocket.send(
            knxPacket.toBuffer(),
            peerPort,
            peerHost,
                err => {
                    if (err) {
                        this.emit(KNXClient.KNXClientEvents.error, err);
                    }
                });
    }

    sendWriteRequest(
        srcAddress: KNXAddress,
        dstAddress: KNXAddress,
        data: KNXDataBuffer,
        cb: (e: Error) => void = null,
        host?: string, port?: number): void {
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
        const seqNum = this._incSeqNumber();
        const knxTunnelingRequest = KNXProtocol.newKNXTunnelingRequest(
            this._channelID,
            seqNum,
            cEMIMessage
        );
        this._setTimerAndCallback(knxTunnelingRequest, cb);
        this.send(knxTunnelingRequest, peerHost, peerPort);
    }

    sendReadRequest(
        srcAddress: KNXAddress,
        dstAddress: KNXAddress,
        cb: (e: Error, d?: Buffer) => void = null, host?: string, port?: number): void {
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
        const seqNum = this._incSeqNumber();
        const knxTunnelingRequest = KNXProtocol.newKNXTunnelingRequest(
            this._channelID,
            seqNum,
            cEMIMessage
        );
        this._setTimerAndCallback(knxTunnelingRequest, cb);
        this.send(knxTunnelingRequest, peerHost, peerPort);
    }

    startDiscovery(host: string , port: number = KNX_CONSTANTS.KNX_PORT): void {
        this._host = host;
        this._port = port;
        this._bindDiscoverySocket(host, port);
        this._discovery_timer = setTimeout(() => {
            this._discovery_timer = null;
        }, 1000 * KNX_CONSTANTS.SEARCH_TIMEOUT);
        this._sendSearchRequestMessage();
    }

    stopDiscovery(): void {
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

    getDescription(host: string, port: number): void {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        this._timer = setTimeout(() => {
            this._timer = null;
        }, 1000 * KNX_CONSTANTS.DEVICE_CONFIGURATION_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNX_CONSTANTS.DESCRIPTION_RESPONSE;
        this._sendDescriptionRequestMessage(host, port);
    }

    openTunnelConnection(host: string, port: number, knxLayer: TunnelTypes = TunnelTypes.TUNNEL_LINKLAYER): void {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        const timeoutError = new Error(`Connection timeout to ${host}:${port}`);
        this._timer = setTimeout(() => {
            this._timer = null;
            this.emit(KNXClient.KNXClientEvents.error, timeoutError);
        }, 1000 * KNX_CONSTANTS.CONNECT_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNX_CONSTANTS.CONNECT_RESPONSE;
        this._sendConnectRequestMessage(host, port, new TunnelCRI(knxLayer));
    }

    getConnectionStatus(host: string, port: number, channelID?: number): void {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        this._timer = setTimeout(() => {
            this._timer = null;
        }, 1000 * KNX_CONSTANTS.CONNECTIONSTATE_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE;
        if (channelID == null) { channelID = this._channelID; }
        this._sendConnectionStateRequestMessage(host, port, channelID);
    }

    disconnect(host: string, port: number, channelID?: number): void {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        this._timer = setTimeout(() => {
            this._timer = null;
        }, 1000 * KNX_CONSTANTS.CONNECT_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNX_CONSTANTS.DISCONNECT_RESPONSE;
        this._connectionState = STATE.DISCONNECTING;
        if (channelID == null) { channelID = this._channelID; }
        this._sendDisconnectRequestMessage(host, port, channelID);
    }

    close(): void {
        if (this._clientSocket) {
            this._clientSocket.close();
            this._clientSocket = null;
        }
    }

    isConnected(): boolean {
        return this._connectionState === STATE.CONNECTED;
    }

    private _incSeqNumber(): number {
        const seq = this._clientTunnelSeqNumber++;
        if (this._clientTunnelSeqNumber > 255) {
            this._clientTunnelSeqNumber = 0;
        }
        return seq;
    }

    private _initDiscoverySocket(): void {
        if (this._discoverySocket == null) {
            throw new Error('No server socket defined');
        }
        this._discoverySocket.on(SocketEvents.error, err => {
            this.emit(KNXClient.KNXClientEvents.error, err);
        });
        this._discoverySocket.on(SocketEvents.message, this._processInboundMessage);
    }

    private _handleResponse(knxTunnelingResponse: KNXTunnelingRequest): void {
        /** @type {LDataInd} */
        const ind: LDataInd = knxTunnelingResponse.cEMIMessage;
        const key: string = this._keyFromCEMIMessage(ind);
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

    private _keyFromCEMIMessage(cEMIMessage: LDataReq): string {
        return cEMIMessage.dstAddress.toString();
    }

    private _setTimerAndCallback(knxTunnelingRequest: KNXTunnelingRequest, cb: (e: Error) => void): void {
        const timeoutErr = new Error(`Request ${knxTunnelingRequest.seqCounter} timed out`);
        const key = this._keyFromCEMIMessage(knxTunnelingRequest.cEMIMessage);
        this._pendingTunnelAnswer.set(
            key,
            {
                cb,
                timer: setTimeout(() => {
                    this._pendingTunnelAnswer.delete(key);
                    if (cb) {
                        cb(timeoutErr);
                    } else {
                        this.emit(KNXClient.KNXClientEvents.error, timeoutErr);
                    }
                }, KNX_CONSTANTS.TUNNELING_REQUEST_TIMEOUT * 2000),
                req: knxTunnelingRequest
            }
        );
        this._tunnelReqTimer.set(knxTunnelingRequest.seqCounter, setTimeout(() => {
            this._tunnelReqTimer.delete(knxTunnelingRequest.seqCounter);
            this._pendingTunnelAnswer.delete(key);
            if (cb) {
                cb(timeoutErr);
            } else {
                this.emit(KNXClient.KNXClientEvents.error, timeoutErr);
            }
        }, KNX_CONSTANTS.TUNNELING_REQUEST_TIMEOUT * 1000));
    }

    private _processInboundMessage(msg: Buffer, rinfo: SocketInfo): void {
        try {
            const {knxHeader, knxMessage} = KNXProtocol.parseMessage(msg);
            if (knxHeader.service_type === KNX_CONSTANTS.SEARCH_RESPONSE) {
                if (this._discovery_timer == null) {
                    return;
                }
                /**
                 * @event KNXClient#discover
                 * @param {string} ip:port
                 * @param {KNXHeader} header
                 * @param {KNXPacket} packet
                 */
                this.emit(KNXClient.KNXClientEvents.discover, `${rinfo.address}:${rinfo.port}`, knxHeader, knxMessage);
            } else if (knxHeader.service_type === KNX_CONSTANTS.CONNECT_RESPONSE) {
                if (this._connectionState === STATE.CONNECTING) {
                    clearTimeout(this._timer);
                    this._timer = null;
                    const knxConnectResponse: KNXConnectResponse = knxMessage as KNXConnectResponse;
                    if (knxConnectResponse.status !== ConnectionStatus.E_NO_ERROR) {
                        // We got an error
                        this._connectionState = STATE.STARTED;
                        this.emit(KNXClient.KNXClientEvents.error, KNXConnectResponse.statusToString(knxConnectResponse.status));
                        return;
                    }
                    this._connectionState = STATE.CONNECTED;
                    this._channelID = knxConnectResponse.channelID;
                    /**
                     * @event KNXClient#connected
                     * @param {string} ip:port
                     * @param {string} channelID
                     */
                    this.emit(KNXClient.KNXClientEvents.connected, `${rinfo.address}:${rinfo.port}`, this._channelID);
                }
            } else if (knxHeader.service_type === KNX_CONSTANTS.DISCONNECT_RESPONSE) {
                if (this._connectionState === STATE.DISCONNECTING) {
                    this._connectionState = STATE.STARTED;
                    this._channelID = null;
                    this.emit(KNXClient.KNXClientEvents.disconnected, `${rinfo.address}:${rinfo.port}`, this._channelID);
                }
            } else if (knxHeader.service_type === KNX_CONSTANTS.DISCONNECT_REQUEST) {
                this._connectionState = STATE.STARTED;
                const knxDisconnectRequest: KNXDisconnectRequest = knxMessage as KNXDisconnectRequest;
                this._sendDisconnectResponseMessage(rinfo.address, rinfo.port, knxDisconnectRequest.channelID);
                this.emit(KNXClient.KNXClientEvents.disconnected, `${rinfo.address}:${rinfo.port}`, knxHeader, knxDisconnectRequest);
            } else if (knxHeader.service_type === KNX_CONSTANTS.TUNNELING_REQUEST) {
                /** @type {KNXTunnelingRequest} */
                const knxTunnelingRequest: KNXTunnelingRequest = knxMessage as KNXTunnelingRequest;
                if (knxTunnelingRequest.cEMIMessage.msgCode === CEMIConstants.L_DATA_IND) {
                    /** @type {LDataInd} */
                    const ind = knxTunnelingRequest.cEMIMessage;
                    if (ind.npdu.isGroupResponse) {
                        this._handleResponse(knxTunnelingRequest);
                    } else {
                        /**
                         * @event KNXClient#indication
                         * @param {KNXAddress} knx src
                         * @param {KNXAddress} knx dst
                         * @param {NPDU} npdu
                         */
                        this.emit(KNXClient.KNXClientEvents.indication,
                            ind.srcAddress,
                            ind.dstAddress,
                            ind.npdu
                        );
                    }
                } else if (knxTunnelingRequest.cEMIMessage.msgCode === CEMIConstants.L_DATA_CON) {
                    this._handleResponse(knxTunnelingRequest);
                }
                const knxTunnelAck = KNXProtocol.newKNXTunnelingACK(
                    knxTunnelingRequest.channelID,
                    knxTunnelingRequest.seqCounter,
                    KNX_CONSTANTS.E_NO_ERROR
                );
                this.send(knxTunnelAck);
            } else if (knxHeader.service_type === KNX_CONSTANTS.TUNNELING_ACK) {
                const knxTunnelingAck: KNXTunnelingAck = knxMessage as KNXTunnelingAck;
                if (this._tunnelReqTimer.has(knxTunnelingAck.seqCounter)) {
                    clearTimeout(this._tunnelReqTimer.get(knxTunnelingAck.seqCounter));
                    this._tunnelReqTimer.delete(knxTunnelingAck.seqCounter);
                }
            } else {
                if (knxHeader.service_type === this._awaitingResponseType) {
                    clearTimeout(this._timer);
                }
                /**
                 * @event KNXClient#response
                 * @param {string} ip:port
                 * @param {KNXHeader} knx header
                 * @param {KNXPacket} knx packet
                 */
                this.emit(KNXClient.KNXClientEvents.response, `${rinfo.address}:${rinfo.port}`, knxHeader, knxMessage);
            }
        } catch (e) {
            /**
             * @event KNXClient#error
             * @type {Error}
             */
            this.emit(KNXClient.KNXClientEvents.error, e);
        }
    }

    private _sendDescriptionRequestMessage(host: string, port: number): void {
        this._clientSocket.send(
            KNXProtocol.newKNXDescriptionRequest(new HPAI(this._host)).toBuffer(),
            port,
            host,
            err => this.emit(KNXClient.KNXClientEvents.error, err)
        );
    }

    private _sendSearchRequestMessage(): void {
        this._discoverySocket.send(
            KNXProtocol.newKNXSearchRequest(new HPAI(this._host, this._port)).toBuffer(),
            KNX_CONSTANTS.KNX_PORT,
            KNX_CONSTANTS.KNX_IP,
            err => this.emit(KNXClient.KNXClientEvents.error, err)
        );
    }

    private _sendConnectRequestMessage(host: string, port: number, cri: CRI): void {
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

    private _sendConnectionStateRequestMessage(host: string, port: number, channelID: number): void {
        this._clientSocket.send(
            KNXProtocol.newKNXConnectionStateRequest(channelID).toBuffer(),
            port,
            host,
            err => this.emit(KNXClient.KNXClientEvents.error, err)
        );
    }

    private _sendDisconnectRequestMessage(host: string, port: number, channelID: number): void {
        this._connectionState = STATE.DISCONNECTING;
        this._clientSocket.send(
            KNXProtocol.newKNXDisconnectRequest(channelID).toBuffer(),
            port,
            host,
            err => this.emit(KNXClient.KNXClientEvents.error, err)
        );
    }

    private _sendDisconnectResponseMessage(
        host: string,
        port: number,
        channelID: number,
        status: ConnectionStatus = ConnectionStatus.E_NO_ERROR): void {
        this._clientSocket.send(
            KNXProtocol.newKNXDisconnectResponse(channelID, status).toBuffer(),
            port,
            host,
            err => this.emit(KNXClient.KNXClientEvents.error, err)
        );
    }

    private _bindDiscoverySocket(host: string, port: number): void {
        if (this._discoverySocket != null) {
            throw new Error('Discovery socket already binded');
        }
        this._discoverySocket = dgram.createSocket({type: 'udp4', reuseAddr: true});
        this._initDiscoverySocket();
        this._discoverySocket.bind(port, host, () => {
            this._discoverySocket.setMulticastInterface(host);
            this._discoverySocket.setMulticastTTL(16);
            this._host = host;
            /**
             * @event ready
             */
            this.emit(KNXClient.KNXClientEvents.ready);
        });
    }
}
