"use strict";
const KNXPacket = require("./KNXPacket");
const {Buffer} = require("buffer");
const KNX_CONSTANTS = require("./KNXConstants");
const HPAI = require("./HPAI");

class KNXDisconnectRequest extends KNXPacket {
    /**
     *
     * @param {number} channelID
     * @param {HPAI} hpaiControl=HPAI.NULLHPAI
     */
    constructor(channelID, hpaiControl = HPAI.NULLHPAI) {
        super(KNX_CONSTANTS.DISCONNECT_REQUEST, hpaiControl.length + 2);
        this.channelID = channelID;
        this.hpaiControl = hpaiControl;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(0, 1);
        return Buffer.concat([
            this.header.toBuffer(),
            buffer,
            this.hpaiControl.toBuffer()
        ]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXDisconnectRequest}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const channelID = buffer.readUInt8(offset++);
        // skip reserved byte
        offset++;
        const hpaiControl = HPAI.fromBuffer(buffer, offset);
        return new KNXDisconnectRequest(channelID, hpaiControl);
    }
}

module.exports = KNXDisconnectRequest;
