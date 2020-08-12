/// <reference types="node" />
declare const _default: {
    new (): {
        readonly type: number;
        readonly length: number;
        readonly services: Map<number, number>;
        _type: number;
        _services: Map<number, number>;
        set(id: number, version: number): void;
        service(id: number): number;
        toBuffer(): Buffer;
    };
    createFromBuffer(buffer: Buffer, offset?: number): {
        readonly type: number;
        readonly length: number;
        readonly services: Map<number, number>;
        _type: number;
        _services: Map<number, number>;
        set(id: number, version: number): void;
        service(id: number): number;
        toBuffer(): Buffer;
    };
};
export = _default;
