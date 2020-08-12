/// <reference types="node" />
export declare enum ConnectionTypes {
    TUNNEL_CONNECTION,
    DEVICE_MGMT_CONNECTION,
    REMLOG_CONNECTION,
    REMCONF_CONNECTION,
    OBJSVR_CONNECTION
}
export declare class CRI {
    private _connectionType;
    constructor(_connectionType: ConnectionTypes);
    get length(): number;
    set connectionType(connectionType: ConnectionTypes);
    get connectionType(): ConnectionTypes;
    toBuffer(): Buffer;
}
