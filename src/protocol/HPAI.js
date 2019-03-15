"use strict";
const KNX_CONSTANTS = require("./KNXConstants");
const {Buffer} = require("buffer");
const HPAI_STRUCTURE_LENGTH = 8;

class HPAI {
    /**
     *
     * @param {string} host
     * @param {number} port
     * @param {number} protocol
     */
    constructor(host, port = KNX_CONSTANTS.KNX_PORT, protocol = KNX_CONSTANTS.IPV4_UDP) {
        this._splitHost = null;
        /** @type string */
        this.host = host;
        this.port = port;
        this.protocol = protocol;

    }

    /**
     *
     * @param {number} proto
     */
    set protocol(proto) {
        if (proto !== KNX_CONSTANTS.IPV4_UDP && proto !== KNX_CONSTANTS.IPV4_TCP) {
            throw new Error(`Invalid protocol ${proto}`);
        }
        this._protocol = proto;
    }

    /**
     *
     * @returns {number}
     */
    get protocol() {
        return this._protocol;
    }

    /**
     *
     * @param {number} port
     */
    set port(port) {
        if (isNaN(port) || typeof(port) !== "number" || port < 0 || port > 65535) {
            throw new Error(`Invalid port ${port}`);
        }
        this._port = port;
    }

    /**
     *
     * @returns {number}
     */
    get port() {
        return this._port;
    }

    /**
     *
     * @returns {KNXHeader}
     */
    get header() {
        return this._header;
    }

    /**
     *
     * @param {string} host
     */
    set host(host) {
        if (host == null) {
            throw new Error("Host undefined");
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
    get host() {
        return this._host;
    }

    get length() {
        return HPAI_STRUCTURE_LENGTH;
    }

    /**
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(HPAI_STRUCTURE_LENGTH);
        let offset = 0;
        buffer.writeUInt8(this.length, offset);
        offset += 1;
        buffer.writeUInt8(this.protocol, offset);
        offset += 1;
        for(let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(this._splitHost[i], offset);
            offset += 1;
        }
        buffer.writeUInt16BE(this.port, offset);
        return buffer;
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset
     * @returns {HPAI}
     */
    static fromBuffer(buffer, offset = 0) {
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
        for(let i = 1; i <= 4; i++) {
            ip.push(buffer.readUInt8(offset));
            offset += 1;
        }
        const port = buffer.readUInt8(offset);
        const host = ip.join(".");
        return new HPAI(host, port, protocol);
    }

    static get NULLHPAI() {
        return NULLHPAI;
    }
}

const NULLHPAI = new HPAI("0.0.0.0", 0);


module.exports = HPAI;

