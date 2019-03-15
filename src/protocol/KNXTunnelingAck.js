"use strict";
const KNXPacket = require("./KNXPacket");
const {Buffer} = require("buffer");
const KNX_CONSTANTS = require("./KNXConstants");
const HPAI = require("./HPAI");
const CRIFactory = require("./CRIFactory");

class KNXTunnelingAck extends KNXPacket {
    /**
     *
     * @param {number} channelID
     * @param {number} seqCounter
     * @param {number} status
     */
    constructor(channelID, seqCounter, status) {
        super(KNX_CONSTANTS.TUNNELING_ACK, 4);
        this.channelID = channelID;
        this.seqCounter = seqCounter;
        this.status = status;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        buffer.writeUInt8(this.length, 0);
        buffer.writeUInt8(this.channelID, 1);
        buffer.writeUInt8(this.seqCounter, 2);
        buffer.writeUInt8(this.status, 3);
        return Buffer.concat([this.header.toBuffer(),buffer]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXTunnelingAck}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error("Buffer too short");
        }
        offset += 1;
        const channelID = buffer.readUInt8(offset++);
        const seqCounter = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset);
        return new KNXTunnelingAck(channelID, seqCounter, status);
    }
}

module.exports = KNXTunnelingAck;
