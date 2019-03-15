"use strict";
const CEMIMessage = require("./CEMIMessage");
const {Buffer} = require("buffer");
const CEMIConstants = require("./CEMIConstants");
const KNXAddress = require("../KNXAddress");
const ControlField = require("./ControlField");
const NPDU = require("./NPDU");

class LDataCon extends CEMIMessage {
    /**
     *
     * @param {Buffer} additionalInfo
     * @param {ControlField} control
     * @param {KNXAddress} srcAddress
     * @param {KNXAddress} dstAddress
     * @param {NPDU} npdu
     */
    constructor(additionalInfo, control, srcAddress, dstAddress, npdu) {
        const length = additionalInfo == null ? 0 : additionalInfo.length;
        const npduLength = npdu == null ? 0 : npdu.length;
        super(CEMIConstants.L_DATA_CON,
            1 + length + control.length + srcAddress.length + dstAddress.length + npduLength);
        this.additionalInfo = additionalInfo;
        this.control = control;
        this.srcAddress = srcAddress;
        this.dstAddress = dstAddress;
        this.npdu = npdu;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(1);
        const msgBuffer = [buffer];
        let offset = 0;
        buffer.writeUInt8(this.msgCode, offset++);
        if (this.additionalInfo == null) {
            buffer.writeUInt8(0, offset);
        }
        else {
            buffer.writeUInt8(this.additionalInfo.length, offset);
            msgBuffer.push(this.additionalInfo.toBuffer());
        }
        msgBuffer.push(this.control.toBuffer());
        msgBuffer.push(this.srcAddress.toBuffer());
        msgBuffer.push(this.dstAddress.toBuffer());
        msgBuffer.push(this.npdu.toBuffer());
        return Buffer.concat(msgBuffer);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {LDataCon}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const addLength = buffer.readUInt8(offset++);
        let additionalInfo = null;
        if (addLength > 0) {
            additionalInfo = buffer.slice(offset, addLength);
            offset += addLength;
        }
        const controlField =  ControlField.fromBuffer(buffer, offset);
        offset += controlField.length;
        const srcAddress =  KNXAddress.fromBuffer(buffer, offset);
        offset += srcAddress.length;
        const dstAddress = KNXAddress.fromBuffer(buffer, offset);
        dstAddress.type = controlField.addressType;
        offset += dstAddress.length;
        const npdu = NPDU.fromBuffer(buffer, offset);
        return new LDataCon(additionalInfo, controlField, srcAddress, dstAddress, npdu);
    }
}

module.exports = LDataCon;
