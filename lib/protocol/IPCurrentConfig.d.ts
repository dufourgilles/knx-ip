/// <reference types="node" />
declare const _default: {
    new (_ip: string, _mask: string, gateway: string, dhcpServer: string, assignment: number): {
        readonly type: number;
        ip: string;
        mask: string;
        gateway: string;
        dhcpServer: string;
        readonly length: number;
        _type: number;
        _splitIP: RegExpMatchArray;
        _splitMask: RegExpMatchArray;
        _splitGateway: RegExpMatchArray;
        _splitDhcpServer: RegExpMatchArray;
        readonly assignment: number;
        toBuffer(): Buffer;
    };
    createFromBuffer(buffer: Buffer, offset?: number): {
        readonly type: number;
        ip: string;
        mask: string;
        gateway: string;
        dhcpServer: string;
        readonly length: number;
        _type: number;
        _splitIP: RegExpMatchArray;
        _splitMask: RegExpMatchArray;
        _splitGateway: RegExpMatchArray;
        _splitDhcpServer: RegExpMatchArray;
        readonly assignment: number;
        toBuffer(): Buffer;
    };
};
export = _default;
