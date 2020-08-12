/// <reference types="node" />
export declare class TLVInfo {
    readonly type: number;
    readonly length: number;
    readonly info: Buffer;
    constructor(type: number, length: number, info: Buffer);
    static createFromBuffer(buffer: Buffer, offset?: number): TLVInfo;
    toBuffer(): Buffer;
}
