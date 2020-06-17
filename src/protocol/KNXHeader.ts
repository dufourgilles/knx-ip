'use strict';
import {KNX_CONSTANTS} from './KNXConstants';

/**
 +-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+
 | Header Length               |            Protocol Version     |
 | (1 Octet)                   |   (1 Octet)                     |
 +-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+
 | Service Type Identifier                                       |
 | (2 Octet)                                                     |
 +-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+
 | Total Length                                                  |
 | (2 Octet)                                                     |
 +-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+
 */
export class KNXHeader {

    get headerLength(): number {
        return this._headerLength;
    }

    get version(): number {
        return this._version;
    }
    readonly service_type: number;
    private _headerLength: number;
    private _version: number;
    private length: number;

    constructor(type: number, length: number) {
        this._headerLength = KNX_CONSTANTS.HEADER_SIZE_10;
        this._version = KNX_CONSTANTS.KNXNETIP_VERSION_10;
        this.service_type = type;
        this.length = KNX_CONSTANTS.HEADER_SIZE_10 + length;
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): KNXHeader {
        if (buffer.length < KNX_CONSTANTS.HEADER_SIZE_10) {
            throw new Error('Incomplete buffer');
        }
        const header_length = buffer.readUInt8(offset);
        if (header_length !== KNX_CONSTANTS.HEADER_SIZE_10) {
            throw new Error(`Invalid buffer length ${header_length}`);
        }
        offset += 1;
        const version = buffer.readUInt8(offset);
        if (version !== KNX_CONSTANTS.KNXNETIP_VERSION_10) {
            throw new Error(`Unknown version ${version}`);
        }
        offset += 1;
        const type = buffer.readUInt16BE(offset);
        offset += 2;
        const length = buffer.readUInt16BE(offset);
        if (length !== buffer.length) {
            throw new Error(`Message length mismatch ${length}/${buffer.length}`);
        }
        return new KNXHeader(type, length - header_length);
    }

    toBuffer(): Buffer {
        const buffer =  Buffer.alloc(this._headerLength);
        let offset = 0;
        buffer.writeUInt8(this._headerLength, offset);
        offset += 1;
        buffer.writeUInt8(this._version, offset);
        offset += 1;
        buffer.writeUInt16BE(this.service_type, offset);
        offset += 2;
        buffer.writeUInt16BE(this.length, offset);
        return buffer;
    }
}
