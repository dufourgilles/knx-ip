"use strict";
const {Buffer} = require("buffer");

class TLVInfo {
    /**
     *
     * @param {number} type
     * @param {number} length
     * @param {Buffer} info
     */
    constructor(type, length, info) {
        this._type = type;
        this._length = length;
        this._info = info;
    }

    /**
     *
     * @returns {number}
     */
    get type() { return this._type; }

    /**
     *
     * @returns {number}
     */
    get length() { return this._length; }

    /**
     *
     * @returns {Buffer}
     */
    get info() { return this._info; }

    toBuffer() {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.type, 0);
        buffer.writeUInt8(this.length, 1);
        return Buffer.concat([buffer, this.info]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {TLVInfo}
     */
    static fromBuffer(buffer, offset = 0) {
        const type = buffer.readUInt8(offset++);
        const length = buffer.readUInt8(offset++);
        const info = Buffer.alloc(length);
        for(let i = 0; i < length; i++) {
            info.writeUInt8(buffer.readUInt8(offset++), i);
        }
        return new TLVInfo(type, length, info);
    }
}

module.exports = TLVInfo;