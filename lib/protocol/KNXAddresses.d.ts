/// <reference types="node" />
import { DIB } from './DIB';
export declare class KNXAddresses implements DIB {
    get length(): number;
    get type(): number;
    private _addresses;
    private _type;
    constructor();
    static createFromBuffer(buffer: Buffer, offset?: number): KNXAddresses;
    add(address: string | number): void;
    toBuffer(): Buffer;
}
