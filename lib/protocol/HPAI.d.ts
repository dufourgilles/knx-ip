/// <reference types="node" />
import { KNXHeader } from './KNXHeader';
export declare enum KnxProtocol {
    IPV4_UDP,
    IPV4_TCP
}
export declare class HPAI {
    private _port;
    private _protocol;
    set protocol(proto: KnxProtocol);
    get protocol(): KnxProtocol;
    set port(port: number);
    get port(): number;
    get header(): KNXHeader;
    set host(host: string);
    get host(): string;
    get length(): number;
    static get NULLHPAI(): HPAI;
    private _header;
    private _splitHost;
    private _host;
    constructor(_host: string, _port?: number, _protocol?: KnxProtocol);
    static createFromBuffer(buffer: Buffer, offset?: number): HPAI;
    toBuffer(): Buffer;
}
