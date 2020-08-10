/// <reference types="node" />
import { KNXHeader } from './KNXHeader';
export declare class KNXPacket {
    readonly type: number;
    readonly length: number;
    private _header;
    constructor(type: number, length: number);
    get header(): KNXHeader;
    toBuffer(): Buffer;
}
