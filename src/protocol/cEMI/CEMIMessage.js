"use strict";

class CEMIMessage {
    /**
     *
     * @param {number} msgCode
     * @param {number} length
     * @param {Buffer} additionalInfo
     */
    constructor(msgCode, length, additionalInfo = null) {
        this.msgCode = msgCode;
        this.length = length;
        this.additionalInfo = additionalInfo;
    }

    toBuffer() {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.msgCode, 0);
        const len = this.additionalInfo == null ? 0 : this.additionalInfo.length;
        buffer.writeUInt8(len, 1);
        if (this.additionalInfo) {
            return Buffer.concat([buffer, this.additionalInfo]);
        }
        return buffer;
    }
}

module.exports = CEMIMessage;
