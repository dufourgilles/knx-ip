/// <reference types="node" />
import { EventEmitter } from 'events';
import { KNXAddress } from './protocol/KNXAddress';
import { KNXDataBuffer } from './protocol/KNXDataBuffer';
export declare enum KNXTunnelSocketEvents {
    disconnected = "disconnected",
    indication = "indication",
    error = "error"
}
export declare class KNXTunnelSocket extends EventEmitter {
    static KNXTunnelSocketEvents: typeof KNXTunnelSocketEvents;
    get channelID(): number;
    private _knxClient;
    private _connectionCB;
    private _disconnectCB;
    private _monitoringBus;
    private _connected;
    private _srcAddress;
    private _host;
    private _port;
    constructor(srcAddress?: string, socketPort?: number);
    bindSocketPort(port: number): Promise<void>;
    close(): void;
    connectAsync(host: string, port: number): Promise<void>;
    disconnectAsync(): Promise<void>;
    writeAsync(dstAddress: KNXAddress, data: KNXDataBuffer): Promise<void>;
    readAsync(dstAddress: KNXAddress): Promise<Buffer>;
    monitorBus(): void;
    stopBusMonitor(): void;
    private _init;
    private _handleBusEvent;
}
