/// <reference types="node" />
declare const _default: {
    new (_ip: string, _mask: string, gateway: string, capabilities: number, assignment: number): {
        readonly type: number;
        ip: string;
        mask: string;
        gateway: string;
        readonly length: number;
        _type: number;
        _splitIP: RegExpMatchArray;
        _splitMask: RegExpMatchArray;
        _splitGateway: RegExpMatchArray;
        readonly capabilities: number;
        readonly assignment: number;
        toBuffer(): Buffer;
    };
    createFromBuffer(buffer: Buffer, offset?: number): {
        readonly type: number;
        ip: string;
        mask: string;
        gateway: string;
        readonly length: number;
        _type: number;
        _splitIP: RegExpMatchArray;
        _splitMask: RegExpMatchArray;
        _splitGateway: RegExpMatchArray;
        readonly capabilities: number;
        readonly assignment: number;
        toBuffer(): Buffer;
    };
};
export = _default;
