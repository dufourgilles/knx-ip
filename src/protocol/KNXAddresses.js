"use strict";
const DIB = require("./DIB");
const KNX_CONSTANTS = require("./KNXConstants");
const {validateKNXAddress} = require("./KNXUtils");

const KNXADDRESSES_LENGTH = 16;

class KNXAddresses extends DIB {
    /**
     *
     */
    constructor() {
        super(KNX_CONSTANTS.KNX_ADDRESSES);
        this._addresses = new Set();
    }

    /**
     *
     * @param {string|number} address
     */
    add(address) {
        this._addresses.add(validateKNXAddress(address));
    }

    /**
     *
     * @returns {number}
     */
    get length() {
        return 2 + this._addresses.size * 2;
    }

    /**
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(IPConfig.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(KNX_CONSTANTS.KNX_ADDRESSES, offset++);

        for(let knxAddress of this._addresses) {
            buffer.writeUInt16BE(knxAddress, offset);
            offset += 2;
        }
        return buffer;
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXAddresses}
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
        if (type != KNX_CONSTANTS.KNX_ADDRESSES) {
            throw new Error(`Invalid KNXAddresses type ${type}`);
        }
        const knxAddresses = new new KNXAddresses();
        for(let i = 2; i < structureLength; i += 2) {
            knxAddresses.add(buffer.readUInt16BE(offset));
            offset += 2;
        }
        return knxAddresses;
    }

}

module.exports = KNXAddresses;
