'use strict';
import { DIB } from './DIB';
import {KNX_CONSTANTS} from './KNXConstants';
import {splitIP} from './KNXUtils';
const IP_CONFIG_LENGTH = 16;

export = class IPConfig implements DIB {

    get type(): number {
        return this._type;
    }

    set ip(ip: string) {
        this._splitIP = splitIP(ip);
    }

    get ip(): string {
        return this._splitIP.input;
    }

    set mask(mask: string) {
        this._splitMask = splitIP(mask, 'mask');
    }

    get mask(): string {
        return this._splitMask.input;
    }

    set gateway(gateway: string) {
        this._splitGateway = splitIP(gateway, 'gateway');
    }

    get length(): number {
        return IP_CONFIG_LENGTH;
    }
    /**
     *
     * @param {string} ip
     * @param {string} mask
     * @param {string} gateway
     * @param {number} capabilities
     * @param {number} assignment
     */
    private _type: number;
    private _splitIP: RegExpMatchArray;
    private _splitMask: RegExpMatchArray;
    private _splitGateway: RegExpMatchArray;

    constructor(_ip: string, _mask: string, gateway: string, readonly capabilities: number, readonly assignment: number) {
        this._type = KNX_CONSTANTS.IP_CONFIG;
        this.ip = _ip;
        this.mask = _mask;
        this.gateway = gateway;
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): IPConfig {
        if (offset + this.length >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error(`offset ${offset} block length: ${structureLength} out of buffer range ${buffer.length}`);
        }
        offset++;
        const type = buffer.readUInt8(offset++);
        if (type !== KNX_CONSTANTS.IP_CONFIG) {
            throw new Error(`Invalid IPConfig type ${type}`);
        }

        const ip = [];
        for (let i = 1; i <= 4; i++) {
            ip.push(buffer.readUInt8(offset++));
        }
        const textIP = ip.join('.');
        const mask = [];
        for (let i = 1; i <= 4; i++) {
            mask.push(buffer.readUInt8(offset++));
        }
        const textMask = mask.join('.');

        const gateway = [];
        for (let i = 1; i <= 4; i++) {
            gateway.push(buffer.readUInt8(offset++));
        }
        const textGateway = gateway.join('.');

        const capabilities = buffer.readUInt8(offset++);
        const assignment = buffer.readUInt8(offset);
        return new IPConfig(textIP, textMask, textGateway, capabilities, assignment);
    }

    toBuffer(): Buffer {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(KNX_CONSTANTS.IP_CONFIG, offset++);

        for (let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(Number(this._splitIP[i]), offset++);
        }
        for (let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(Number(this._splitMask[i]), offset++);
        }
        for (let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(Number(this._splitGateway[i]), offset++);
        }
        buffer.writeUInt8(this.capabilities, offset++);
        buffer.writeUInt8(this.assignment, offset);
        return buffer;
    }
};
