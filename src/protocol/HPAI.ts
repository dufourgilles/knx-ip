'use strict';
import {KNX_CONSTANTS} from './KNXConstants';
import KNXHeader = require('./KNXHeader');
const HPAI_STRUCTURE_LENGTH = 8;

export enum KnxProtocol {
    IPV4_UDP = KNX_CONSTANTS.IPV4_UDP,
    IPV4_TCP = KNX_CONSTANTS.IPV4_TCP
}
export class HPAI {

    set protocol(proto: KnxProtocol) {
        this._protocol = proto;
    }

    get protocol(): KnxProtocol {
        return this._protocol;
    }

    set port(port: number) {
        if (isNaN(port) || typeof(port) !== 'number' || port < 0 || port > 65535) {
            throw new Error(`Invalid port ${port}`);
        }
        this._port = port;
    }

    get port(): number {
        return this._port;
    }

    get header(): KNXHeader {
        return this._header;
    }

    set host(host: string) {
        if (host == null) {
            throw new Error('Host undefined');
        }
        const m = host.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
        if (m === null) {
            throw new Error(`Invalid host format - ${host}`);
        }
        this._host = host;
        this._splitHost = m;
    }

    /**
     *
     * @returns {string}
     */
    get host(): string {
        return this._host;
    }

    get length(): number {
        return HPAI_STRUCTURE_LENGTH;
    }

    static get NULLHPAI(): HPAI {
        const NULLHPAI = new HPAI('0.0.0.0', 0);
        return NULLHPAI;
    }
    private _header: KNXHeader;
    private _splitHost: RegExpMatchArray;
    private _host: string;

    constructor( _host: string, private _port: number = KNX_CONSTANTS.KNX_PORT, private _protocol: KnxProtocol = KNX_CONSTANTS.IPV4_UDP) {
        this.host = _host;
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): HPAI {
        if (offset >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error(`offset ${offset} block length: ${structureLength} out of buffer range ${buffer.length}`);
        }
        offset++;
        const protocol =  buffer.readUInt8(offset);
        offset += 1;
        const ip = [];
        for (let i = 1; i <= 4; i++) {
            ip.push(buffer.readUInt8(offset));
            offset += 1;
        }
        const port = buffer.readUInt8(offset);
        const host = ip.join('.');
        return new HPAI(host, port, protocol);
    }

    toBuffer(): Buffer {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset);
        offset += 1;
        buffer.writeUInt8(this.protocol, offset);
        offset += 1;
        for (let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(Number(this._splitHost[i]), offset);
            offset += 1;
        }
        buffer.writeUInt16BE(this.port, offset);
        return buffer;
    }
}
