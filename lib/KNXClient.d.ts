/// <reference types="node" />
import { EventEmitter } from 'events';
import { KNXPacket } from './protocol/KNXPacket';
import { KNXDataBuffer } from './protocol/KNXDataBuffer';
import { KNXAddress } from './protocol/KNXAddress';
import { TunnelTypes } from './protocol/TunnelCRI';
declare enum KNXClientEvents {
    error = "error",
    disconnected = "disconnected",
    discover = "discover",
    indication = "indication",
    connected = "connected",
    ready = "ready",
    response = "response"
}
export declare class KNXClient extends EventEmitter {
    static KNXClientEvents: typeof KNXClientEvents;
    get channelID(): number;
    private _host;
    private _port;
    private _peerHost;
    private _peerPort;
    private _timer;
    private _discovery_timer;
    private _awaitingResponseType;
    private _discoverySocket;
    private _clientSocket;
    private _clientTunnelSeqNumber;
    private _channelID;
    private _connectionState;
    private _tunnelReqTimer;
    private _pendingTunnelAnswer;
    constructor();
    bindSocketPort(port: number): void;
    send(knxPacket: KNXPacket, host?: string, port?: number): void;
    sendWriteRequest(srcAddress: KNXAddress, dstAddress: KNXAddress, data: KNXDataBuffer, cb?: (e: Error) => void, host?: string, port?: number): void;
    sendReadRequest(srcAddress: KNXAddress, dstAddress: KNXAddress, cb?: (e: Error, d?: Buffer) => void, host?: string, port?: number): void;
    startDiscovery(host: string, port?: number): void;
    stopDiscovery(): void;
    getDescription(host: string, port: number): void;
    openTunnelConnection(host: string, port: number, knxLayer?: TunnelTypes): void;
    getConnectionStatus(host: string, port: number, channelID?: number): void;
    disconnect(host: string, port: number, channelID?: number): void;
    close(): void;
    isConnected(): boolean;
    private _incSeqNumber;
    private _initDiscoverySocket;
    private _handleResponse;
    private _keyFromCEMIMessage;
    private _setTimerAndCallback;
    private _processInboundMessage;
    private _sendDescriptionRequestMessage;
    private _sendSearchRequestMessage;
    private _sendConnectRequestMessage;
    private _sendConnectionStateRequestMessage;
    private _sendDisconnectRequestMessage;
    private _sendDisconnectResponseMessage;
    private _bindDiscoverySocket;
}
export {};
