/// <reference types="node" />
import { TLVInfo } from './TLVInfo';
export declare class AdditionalInfo {
    private _tlvs;
    private _length;
    constructor(_tlvs?: TLVInfo[]);
    static createFromBuffer(buffer: Buffer, offset?: number): AdditionalInfo;
    addTLV(tlv: TLVInfo): void;
    toBuffer(): Buffer;
}
