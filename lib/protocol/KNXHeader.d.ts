/// <reference types="node" />
export declare class KNXHeader {
    get headerLength(): number;
    get version(): number;
    readonly service_type: number;
    private _headerLength;
    private _version;
    private length;
    constructor(type: number, length: number);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXHeader;
    toBuffer(): Buffer;
}
