'use strict';
import { DIB } from './DIB';
import {KNX_CONSTANTS} from './KNXConstants';
import {splitIP} from './KNXUtils';
const IP_CURRENT_CONFIG_LENGTH = 20;

export = class IPCurrentConfig implements DIB {

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

    set dhcpServer(dhcpServer: string) {
        this._splitDhcpServer = splitIP(dhcpServer, 'dhcpServer');
    }

    get dhcpServer(): string {
        return this._splitDhcpServer.input;
    }

    get length(): number {
        return IP_CURRENT_CONFIG_LENGTH;
    }
    private _type: number;
    private _splitIP: RegExpMatchArray;
    private _splitMask: RegExpMatchArray;
    private _splitGateway: RegExpMatchArray;
    private _splitDhcpServer: RegExpMatchArray;
    constructor(_ip: string, _mask: string, gateway: string, dhcpServer: string, readonly assignment: number) {
        this._type = KNX_CONSTANTS.IP_CONFIG;
        this.ip = _ip;
        this.mask = _mask;
        this.gateway = gateway;
        this.dhcpServer = dhcpServer;
        this.assignment = assignment;
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): IPCurrentConfig {
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

        const dhcpServer = [];
        for (let i = 1; i <= 4; i++) {
            dhcpServer.push(buffer.readUInt8(offset++));
        }
        const textDhcpServer = dhcpServer.join('.');
        const assignment = buffer.readUInt8(offset);
        return new IPCurrentConfig(textIP, textMask, textGateway, textDhcpServer, assignment);
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
        for (let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(Number(this._splitDhcpServer[i]), offset++);
        }
        buffer.writeUInt8(this.assignment, offset);
        return buffer;
    }
};
