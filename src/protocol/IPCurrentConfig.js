"use strict";
const DIB = require("./DIB");
const KNX_CONSTANTS = require("./KNXConstants");
const {splitIP} = require("./KNXUtils");
const IP_CURRENT_CONFIG_LENGTH = 20;

class IPCurrentConfig extends DIB {
    /**
     *
     * @param {string} ip
     * @param {string} mask
     * @param {string} gateway
     * @param {string} dhcpServer
     * @param {number} assignment
     */
    constructor(ip, mask, gateway, dhcpServer, assignment) {
        super(KNX_CONSTANTS.IP_CONFIG);
        this.ip = ip;
        this.mask = mask;
        this.gateway = gateway;
        this.dhcpServer = dhcpServer;
        this.assignment = assignment;
    }

    /**
     *
     * @param {string} ip
     */
    set ip(ip) {
        this._splitIP = splitIP(ip);
    }

    /**
     *
     * @returns {string}
     */
    get ip() {
        return this._splitIP.input;
    }

    /**
     *
     * @param {string} mask
     */
    set mask(mask) {
        this._splitMask = splitIP(mask, "mask");
    }

    /**
     *
     * @returns {string}
     */
    get mask() {
        return this._splitMask.input;
    }

    /**
     *
     * @param {string} gateway
     */
    set gateway(gateway) {
        this._splitGateway = splitIP(gateway, "gateway");
    }

    /**
     *
     * @returns {string}
     */
    get mask() {
        return this._splitMask.input;
    }

    /**
     *
     * @param {string} dhcpServer
     */
    set dhcpServer(dhcpServer) {
        this._splitDhcpServer = splitIP(dhcpServer, "dhcpServer");
    }

    /**
     *
     * @returns {string}
     */
    get dhcpServer() {
        return this._splitDhcpServer.input;
    }

    /**
     *
     * @returns {number}
     */
    get length() {
        return IP_CURRENT_CONFIG_LENGTH;
    }

    /**
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(IPConfig.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(KNX_CONSTANTS.IP_CONFIG, offset++);

        for(let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(this._splitIP[i], offset++);
        }
        for(let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(this._splitMask[i], offset++);
        }
        for(let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(this._splitGateway[i], offset++);
        }
        for(let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(this._splitDhcpServer[i], offset++);
        }
        buffer.writeUInt8(this.assignment, offset);
        return buffer;
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset + this.length >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error(`offset ${offset} block length: ${structureLength} out of buffer range ${buffer.length}`);
        }
        offset++;
        const type = buffer.readUInt8(offset++);
        if (type != KNX_CONSTANTS.IP_CONFIG) {
            throw new Error(`Invalid IPConfig type ${type}`);
        }

        const ip = [];
        for (let i = 1; i <= 4; i++) {
            ip.push(buffer.readUInt8(offset++));
        }
        const textIP = ip.join(".");
        const mask = [];
        for (let i = 1; i <= 4; i++) {
            mask.push(buffer.readUInt8(offset++));
        }
        const textMask = mask.join(".");

        const gateway = [];
        for (let i = 1; i <= 4; i++) {
            gateway.push(buffer.readUInt8(offset++));
        }
        const textGateway = gateway.join(".");

        const dhcpServer = [];
        for (let i = 1; i <= 4; i++) {
            dhcpServer.push(buffer.readUInt8(offset++));
        }
        const textDhcpServer = dhcpServer.join(".");
        const assignment = buffer.readUInt8(offset);
        return new IPConfig(textIP, textMask, textGateway, textDhcpServer, assignment);
    }
}

module.exports = IPCurrentConfig;
