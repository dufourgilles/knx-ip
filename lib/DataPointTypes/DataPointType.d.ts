/// <reference types="node" />
import { Encoder, Decoder, DPT } from './definitions';
export declare class DataPointType {
    private _type;
    private _subtype;
    private _encoder;
    private _decoder;
    get type(): string;
    get subtype(): string;
    static get TYPES(): {
        [index: string]: DPT | null;
    };
    constructor(_type: string, _subtype: string, _encoder: Encoder, _decoder: Decoder);
    static validType(text: string): boolean;
    toString(): string;
    decode(buffer: Buffer): string | number;
    encode(value: string | number): Buffer;
}
