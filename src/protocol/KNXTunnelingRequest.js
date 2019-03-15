"use strict";
const KNXPacket = require("./KNXPacket");
const {Buffer} = require("buffer");
const KNX_CONSTANTS = require("./KNXConstants");
const CEMIFactory = require("./cEMI/CEMIFactory");

class KNXTunnelingRequest extends KNXPacket {
    /**
     *
     * @param {number} channelID
     * @param {number} seqCounter
     * @param {CEMIMessage} cEMIMessage
     */
    constructor(channelID, seqCounter, cEMIMessage) {
        super(KNX_CONSTANTS.TUNNELING_REQUEST, 4 + cEMIMessage.length);
        this.channelID = channelID;
        this.seqCounter = seqCounter;
        this.cEMIMessage = cEMIMessage;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(4);
        // structure length
        buffer.writeUInt8(4, 0);
        buffer.writeUInt8(this.channelID, 1);
        buffer.writeUInt8(this.seqCounter, 2);
        //reserved byte
        buffer.writeUInt8(0, 3);
        return Buffer.concat([this.header.toBuffer(),buffer, this.cEMIMessage.toBuffer()]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset
     * @returns {CEMIMessage}
     */
    static parseCEMIMessage(buffer, offset) {
        if (offset > buffer.length) {
            throw new Error("Buffer too short");
        }
        const msgCode =  buffer.readUInt8(offset++);
        return CEMIFactory.fromBuffer(msgCode, buffer, offset);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXTunnelingRequest}
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
        const channelID =  buffer.readUInt8(offset++);
        const seqCounter =  buffer.readUInt8(offset++);
        // skip reserved byte
        offset++;
        const cEMIMessage = this.parseCEMIMessage(buffer, offset);
        return new KNXTunnelingRequest(channelID, seqCounter, cEMIMessage);
    }
}

module.exports = KNXTunnelingRequest;
