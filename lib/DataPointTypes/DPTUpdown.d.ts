/// <reference types="node" />
declare const _default: {
    new (): {
        readonly type: string;
        readonly subtype: string;
        _type: string;
        _subtype: string;
        _encoder: import("./definitions").Encoder;
        _decoder: import("./definitions").Decoder;
        toString(): string;
        decode(buffer: Buffer): string | number;
        encode(value: string | number): Buffer;
    };
    readonly TYPES: {
        [index: string]: import("./definitions").DPT;
    };
    validType(text: string): boolean;
};
export = _default;
