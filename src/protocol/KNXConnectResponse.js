"use strict";
const KNXPacket = require("./KNXPacket");
const {Buffer} = require("buffer");
const KNX_CONSTANTS = require("./KNXConstants");
const HPAI = require("./HPAI");
const CRD = require("./CRD");

class KNXConnectResponse extends KNXPacket {
    /**
     *
     * @param {number} channelID
     * @param {number} status
     * @param {HPAI} hpai
     * @param {CRD} crd
     */
    constructor(channelID, status, hpai, crd) {
        super(KNX_CONSTANTS.CONNECT_RESPONSE, 2 + hpai.length + crd.length);
        this.channelID = channelID;
        this.status = status;
        this.hpai = hpai;
        this.crd = crd;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(this.status, 1);
        return Buffer.concat([buffer, this.hpai.toBuffer(), this.crd.toBuffer()]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXConnectResponse}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset + 2 >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const channelID = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset++);
        const hpai = HPAI.fromBuffer(buffer, offset);
        offset += hpai.length;
        const crd = CRD.fromBuffer(buffer, offset);
        return new KNXConnectResponse(channelID, status, hpai, crd);
    }
}

module.exports = KNXConnectResponse;
