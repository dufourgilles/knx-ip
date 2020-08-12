/// <reference types="node" />
import { CRI } from './CRI';
export declare enum TunnelTypes {
    TUNNEL_LINKLAYER,
    TUNNEL_RAW,
    TUNNEL_BUSMONITOR
}
export declare class TunnelCRI extends CRI {
    knxLayer: TunnelTypes;
    get length(): number;
    constructor(knxLayer: TunnelTypes);
    static createFromBuffer(buffer: Buffer, offset?: number): TunnelCRI;
    toBuffer(): Buffer;
}
