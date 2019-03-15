"use strict";
const KNXPacket = require("./KNXPacket");
const {Buffer} = require("buffer");
const KNX_CONSTANTS = require("./KNXConstants");
const HPAI = require("./HPAI");

class KNXDescriptionRequest extends KNXPacket {
    /**
     *
     * @param {HPAI} hpai
     */
    constructor(hpai) {
        super(KNX_CONSTANTS.DESCRIPTION_REQUEST, hpai.length);
        this.hpai = hpai;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        return Buffer.concat([this.header.toBuffer(), this.hpai.toBuffer()]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXDescriptionRequest}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset + this.length >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const hpai = HPAI.fromBuffer(buffer, offset);
        return new KNXDescriptionRequest(hpai);
    }
}

module.exports = KNXDescriptionRequest;
