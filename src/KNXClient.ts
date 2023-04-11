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
import { KNXConnectionStateResponse } from './protocol/KNXConnectionStateResponse';
import { KNXSocketOptions } from './KNXSocketOptions';
import { DuplicateRequestError, RequestTimeoutError } from './errors';
import { IKNXClient } from './IKNXClient';

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

export class KNXClient extends EventEmitter implements IKNXClient {

    get channelID(): number {
        return this._channelID;
    }

    static  KNXClientEvents = KNXClientEvents;
    public max_HeartbeatFailures: number;
    private readonly _options: KNXSocketOptions;
    private _host: string;
    private _port: number;
    private _peerHost: string;
    private _peerPort: number;
    private _timer: NodeJS.Timeout;
    private _heartbeatTimer: NodeJS.Timeout;
    private _heartbeatFailures: number;
    private _heartbeatRunning: boolean;
    private _discovery_timer: NodeJS.Timeout;
    private _awaitingResponseType: number;
    private _clientSocket: dgram.Socket;
    private _clientTunnelSeqNumber = 0;
    private _channelID: number;
    private _connectionState: STATE;
    private _tunnelReqTimer: Map<number, NodeJS.Timeout>;
    private _pendingTunnelAnswer: Map<string, PendingAnswer>;
    /**
     *
     */
    constructor(options: KNXSocketOptions) {
        super();
        this._options = options;
        this._host = null;
        this._port = null;
        this._peerHost = null;
        this._peerPort = null;
        this._timer = null;
        this._heartbeatFailures = 0;
        this.max_HeartbeatFailures = 3;
        this._heartbeatTimer = null;
        this._discovery_timer = null;
        this._awaitingResponseType = null;
        this._processInboundMessage = this._processInboundMessage.bind(this);
        this._clientSocket = dgram.createSocket({type: 'udp4', reuseAddr: true});
        this._clientSocket.on(SocketEvents.message, this._processInboundMessage);
        this._clientSocket.on(SocketEvents.error, error => this.emit(KNXClient.KNXClientEvents.error, error));
        this._clientTunnelSeqNumber = 0;
        this._channelID = null;
        this._connectionState = STATE.STARTED;
        this._tunnelReqTimer = new Map();
        this._pendingTunnelAnswer = new Map();
    }

    /**
     *
     * @param {number = 3671} port
     * @param {string = '0.0.0.0'} host
     */
    bindSocketPortAsync(port = KNX_CONSTANTS.KNX_PORT, host = '0.0.0.0'): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this._clientSocket.bind(port, host, () => {
                    this._clientSocket.setMulticastInterface(host);
                    this._clientSocket.setMulticastTTL(16);
                    this._host = host;
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     *
     * @param {KNXPacket} knxPacket
     * @param {string} host
     * @param {number} port
     */
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

    /**
     *
     * @param {KNXAddress} srcAddress
     * @param {KNXAddress} dstAddress
     * @param {KNXDataBuffer} data
     * @param {function} cb
     * @param {string} host
     * @param {number} port
     */
    sendWriteRequest(
        srcAddress: KNXAddress,
        dstAddress: KNXAddress,
        data: KNXDataBuffer,
        cb: (e: Error) => void = null,
        host?: string, port?: number): void {
        const key = dstAddress.toString();
        if (this._pendingTunnelAnswer.has(key)) {
            const err = new DuplicateRequestError(`Request already pending for ${key}`);
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
        const seqNum = this._getSeqNumber();
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
     * @param {KNXAddress} srcAddress
     * @param {KNXAddress} dstAddress
     * @param {function} cb
     * @param {string} host
     * @param {number} port
     */
    sendReadRequest(
        srcAddress: KNXAddress,
        dstAddress: KNXAddress,
        cb: (e: Error, d?: Buffer) => void = null, host?: string, port?: number): void {
        const key = dstAddress.toString();
        if (this._pendingTunnelAnswer.has(key)) {
            const err = new DuplicateRequestError(`Request already pending for ${key}`);
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
        const seqNum = this._getSeqNumber();
        const knxTunnelingRequest = KNXProtocol.newKNXTunnelingRequest(
            this._channelID,
            seqNum,
            cEMIMessage
        );
        this._setTimerAndCallback(knxTunnelingRequest, cb);
        this.send(knxTunnelingRequest, peerHost, peerPort);
    }

    /**
     * Start Heart Beat - Automatically started on connect
     */
    startHeartBeat(): void {
        this._heartbeatFailures = 0;
        this._heartbeatRunning = true;
        this._runHeartbeat();
    }

    /**
     * Stop Heart Beat
     */
    stopHeartBeat(): void {
        this._heartbeatRunning = false;
        clearTimeout(this._heartbeatTimer);
    }

    /**
     * @return {boolean}
     */
    isDiscoveryRunning(): boolean {
        return this._discovery_timer != null;
    }

    /**
     * Start KNX Gateway discovery
     */
    startDiscovery(): void {
        if (this.isDiscoveryRunning()) {
            throw new Error('Discovery already running');
        }
        this._discovery_timer = setTimeout(() => {
            this._discovery_timer = null;
        }, 1000 * KNX_CONSTANTS.SEARCH_TIMEOUT);
        this._sendSearchRequestMessage();
    }

    /**
     *
     */
    stopDiscovery(): void {
        if (!this.isDiscoveryRunning()) {
            return;
        }
        clearTimeout(this._discovery_timer);
        this._discovery_timer = null;
    }

    /**
     *
     * @param {string} host
     * @param {number} port
     */
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

    /**
     *
     * @param {string} host
     * @param {number} port
     * @param {TunnelTypes = TunnelTypes.TUNNEL_LINKLAYER} knxLayer
     */
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
        this._clientTunnelSeqNumber = 0;
        this._sendConnectRequestMessage(host, port, new TunnelCRI(knxLayer));
    }

    /**
     *
     * @param {string} host
     * @param {number} port
     * @param {number} channelID
     */
    getConnectionStatus(host: string, port: number, _channelID?: number): void {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        const channelID = _channelID == null ? this._channelID : _channelID;
        const timeoutError = new Error(`HeartBeat failure with ${host}:${port}`);
        const deadError = new Error(`Connection dead with ${host}:${port}`);
        this._heartbeatTimer = setTimeout(() => {
            this._heartbeatTimer = null;
            this.emit(KNXClient.KNXClientEvents.error, timeoutError);
            this._heartbeatFailures++;
            if (this._heartbeatFailures >= this.max_HeartbeatFailures) {
                this.emit(KNXClient.KNXClientEvents.error, deadError);
                this.setDisconnected(host, port, channelID);
            }
        }, 1000 * KNX_CONSTANTS.CONNECTIONSTATE_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE;
        this._sendConnectionStateRequestMessage(host, port, channelID);
    }

    /**
     *
     * @param {string} host
     * @param {number} port
     * @param {number?} channelID
     */
    disconnect(host: string, port: number, channelID?: number): void {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        this.stopHeartBeat();
        this._timer = setTimeout(() => {
            this._timer = null;
        }, 1000 * KNX_CONSTANTS.CONNECT_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNX_CONSTANTS.DISCONNECT_RESPONSE;
        this._connectionState = STATE.DISCONNECTING;
        if (channelID == null) { channelID = this._channelID; }
        this._sendDisconnectRequestMessage(host, port, channelID);
    }

    /**
     *
     */
    close(): void {
        if (this._clientSocket) {
            this._clientSocket.close();
            this._clientSocket = null;
        }
    }

    /**
     * @return {boolean}
     */
    isConnected(): boolean {
        return this._connectionState === STATE.CONNECTED;
    }

    private setDisconnected(host: string, port: number, channelID: number): void {
        this.stopHeartBeat();
        this._connectionState = STATE.STARTED;
        this.emit(KNXClient.KNXClientEvents.disconnected, `${host}:${port}#${channelID}`);
        this._channelID = null;
    }

    private _runHeartbeat(): void {
        if (this._heartbeatRunning) {
            this.getConnectionStatus(this._peerHost, this._peerPort);

            setTimeout(() => {
                this._runHeartbeat();
            }, 1000 * this._options.connectionKeepAliveTimeout);
        }
    }

    private _getSeqNumber(): number {
        return this._clientTunnelSeqNumber;
    }

    private _incSeqNumber(seq?: number): number {
        this._clientTunnelSeqNumber = seq ? seq + 1 : this._clientTunnelSeqNumber + 1;
        if (this._clientTunnelSeqNumber > 255) {
            this._clientTunnelSeqNumber = 0;
        }
        return this._clientTunnelSeqNumber;
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
        const timeoutErr = new RequestTimeoutError(`Request ${knxTunnelingRequest.seqCounter} timed out`);
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
                    this.setDisconnected(rinfo.address, rinfo.port, this._channelID);
                } else {
                    this.emit(KNXClientEvents.error, new Error('Unexpected Disconnect Response.'));
                }
            } else if (knxHeader.service_type === KNX_CONSTANTS.DISCONNECT_REQUEST) {
                const knxDisconnectRequest: KNXDisconnectRequest = knxMessage as KNXDisconnectRequest;
                if (knxDisconnectRequest.channelID !== this._channelID) {
                    // Not for us or old session -> ignore
                    return;
                }
                this._connectionState = STATE.STARTED;
                this._sendDisconnectResponseMessage(rinfo.address, rinfo.port, knxDisconnectRequest.channelID);
                this.setDisconnected(rinfo.address, rinfo.port, this._channelID);
            } else if (knxHeader.service_type === KNX_CONSTANTS.TUNNELING_REQUEST) {
                /** @type {KNXTunnelingRequest} */
                const knxTunnelingRequest: KNXTunnelingRequest = knxMessage as KNXTunnelingRequest;
                if (knxTunnelingRequest.channelID !== this._channelID) {
                    // Not for us or old session -> ignore
                    return;
                }
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
                if (knxTunnelingAck.channelID !== this._channelID) {
                    // Not for us or old session -> ignore
                    return;
                }
                this._incSeqNumber(knxTunnelingAck.seqCounter);
                if (this._tunnelReqTimer.has(knxTunnelingAck.seqCounter)) {
                    clearTimeout(this._tunnelReqTimer.get(knxTunnelingAck.seqCounter));
                    this._tunnelReqTimer.delete(knxTunnelingAck.seqCounter);
                } else {
                    this.emit(
                        KNXClient.KNXClientEvents.error,
                        `Unexpected Tunnel Ack ${knxTunnelingAck.seqCounter}`
                    );
                }
            } else {
                if (knxHeader.service_type === this._awaitingResponseType) {
                    if (this._awaitingResponseType === KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE) {
                        const knxConnectionStateResponse = knxMessage as KNXConnectionStateResponse;
                        if (knxConnectionStateResponse.status !== KNX_CONSTANTS.E_NO_ERROR) {
                            // There was a connection error. Disconnect.
                            this.emit(
                                KNXClient.KNXClientEvents.error,
                                KNXConnectionStateResponse.statusToString(knxConnectionStateResponse.status)
                            );
                            this.setDisconnected(rinfo.address, rinfo.port, this._channelID);
                        } else {
                            clearTimeout(this._heartbeatTimer);
                            this._heartbeatFailures = 0;
                        }
                    } else {
                        clearTimeout(this._timer);
                    }
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
        this._clientSocket.send(
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
}
