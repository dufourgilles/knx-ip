"use strict";
const KNXPacket = require("./KNXPacket");
const {Buffer} = require("buffer");
const KNX_CONSTANTS = require("./KNXConstants");

class KNXDisconnectResponse extends KNXPacket {
    /**
     *
     * @param {number} channelID
     * @param {number} status
     */
    constructor(channelID, status) {
        super(KNX_CONSTANTS.DISCONNECT_RESPONSE, 2);
        this.channelID = channelID;
        this.status = status;
    }

    /**
     *
     * @returns {number}
     */
    get status() {
        return this._status;
    }

    /**
     *
     * @param {number} status
     */
    set status(status) {
        if (status === KNX_CONSTANTS.E_CONNECTION_ID ||
            status === KNX_CONSTANTS.E_NO_ERROR ||
            status === KNX_CONSTANTS.E_DATA_CONNECTION||
            status === KNX_CONSTANTS.E_KNX_CONNECTION) {
            this._status = status;
        }
        else {
            throw new Error(`Invalid status ${status}`);
        }
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(this.status, 1);
        return Buffer.concat([this.header.toBuffer(), buffer]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXDisconnectResponse}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const channelID = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset);
        return new KNXDisconnectResponse(channelID, status);
    }
}

module.exports = KNXDisconnectResponse;
