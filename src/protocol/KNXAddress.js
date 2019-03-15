"use strict";

const {validateKNXAddress} = require("./KNXUtils");
const ADDRESS_LENGTH = 2;
const TYPE_INDIVIDUAL = 0;
const TYPE_GROUP = 1;
const LEVEL_TWO = 2;
const LEVEL_THREE = 3;

class KNXAddress {
    /**
     *
     * @param {string|number} address
     * @param {number} type=TYPE_INDIVIDUAL
     * @param {number} level=LEVEL_THREE
     */
    constructor(address, type=TYPE_INDIVIDUAL, level=LEVEL_THREE) {
        this.type = type;
        this.level = level;
        this.set(address);
        this.length = ADDRESS_LENGTH;
    }

    /**
     *
     * @param {string|number} address
     */
    set(address) {
        if (typeof(address) === "string") {
            this._address = validateKNXAddress(address, this.type);
        }
        else if (isNaN(address)) {
            throw new Error("Invalid address format");
        }
        else if (address > 0xFFFF) {
            throw new Error("Invalid address number");
        }
        else {
            this._address = address;
        }
    }

    /**
     *
     * @returns {number}
     */
    get() {
        return this._address;
    }

    /**
     *
     * @returns {string}
     */
    toString() {
        const digits = [];
        if (this.level === LEVEL_TWO) {
            digits.push((this._address >> 8) & 0xFF);
            digits.push(this._address & 0xFF);
        } else {
            if (this._address > 0x7FF) {
                if (this.type === TYPE_GROUP) {
                    digits.push((this._address >> 11) & 0x1F);
                } else {
                    digits.push((this._address >> 12) & 0x0F);
                }
            }
            if (this.type === TYPE_GROUP) {
                digits.push((this._address >> 8) & 0x07);
            } else {
                digits.push((this._address >> 8) & 0x0F);
            }
        }
        digits.push(this._address & 0xFF);
        return digits.join(".");
    }

    /**
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        buffer.writeUInt16BE(this._address, 0);
        return buffer;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get TYPE_INDIVIDUAL() {
        return TYPE_INDIVIDUAL;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get TYPE_GROUP() {
        return TYPE_GROUP;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get LEVEL_TWO() {
        return LEVEL_TWO;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get LEVEL_THREE() {
        return LEVEL_THREE;
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXAddress}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset + ADDRESS_LENGTH >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const address = buffer.readUInt16BE(offset);
        return new KNXAddress(address);
    }
}

module.exports = KNXAddress;
