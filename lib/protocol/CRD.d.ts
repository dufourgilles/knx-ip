/// <reference types="node" />
import { KNXAddress } from './KNXAddress';
export declare enum ConnectionType {
    TUNNEL_CONNECTION,
    DEVICE_MGMT_CONNECTION,
    REMLOG_CONNECTION,
    REMCONF_CONNECTION,
    OBJSVR_CONNECTION
}
export declare class CRD {
    set knxAddress(knxAddress: KNXAddress);
    get knxAddress(): KNXAddress;
    get length(): number;
    set connectionType(connectionType: ConnectionType);
    get connectionType(): ConnectionType;
    private _knxAddress;
    private _connectionType;
    constructor(connectionType: ConnectionType, knxAddress: KNXAddress);
    static createFromBuffer(buffer: Buffer, offset: number): CRD;
    toBuffer(): Buffer;
}
