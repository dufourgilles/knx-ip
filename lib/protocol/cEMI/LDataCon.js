'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LDataCon = void 0;
const CEMIMessage_1 = require("./CEMIMessage");
const CEMIConstants_1 = require("./CEMIConstants");
const KNXAddress_1 = require("../KNXAddress");
const ControlField_1 = require("./ControlField");
const NPDU_1 = require("./NPDU");
const KNXDataBuffer_1 = require("../KNXDataBuffer");
class LDataCon extends CEMIMessage_1.CEMIMessage {
    constructor(additionalInfo, control, srcAddress, dstAddress, npdu) {
        super(CEMIConstants_1.CEMIConstants.L_DATA_CON, CEMIMessage_1.CEMIMessage.GetLength(additionalInfo, control, srcAddress, dstAddress, npdu), additionalInfo, control, srcAddress, dstAddress, npdu);
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const addLength = buffer.readUInt8(offset++);
        let additionalInfo = null;
        if (addLength > 0) {
            additionalInfo = new KNXDataBuffer_1.KNXDataBuffer(buffer.slice(offset, addLength));
            offset += addLength;
        }
        const controlField = ControlField_1.ControlField.createFromBuffer(buffer, offset);
        offset += controlField.length;
        const srcAddress = KNXAddress_1.KNXAddress.createFromBuffer(buffer, offset);
        offset += srcAddress.length;
        const dstAddress = KNXAddress_1.KNXAddress.createFromBuffer(buffer, offset, controlField.addressType);
        offset += dstAddress.length;
        const npdu = NPDU_1.NPDU.createFromBuffer(buffer, offset);
        return new LDataCon(additionalInfo, controlField, srcAddress, dstAddress, npdu);
    }
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
            msgBuffer.push(this.additionalInfo.value);
        }
        msgBuffer.push(this.control.toBuffer());
        msgBuffer.push(this.srcAddress.toBuffer());
        msgBuffer.push(this.dstAddress.toBuffer());
        msgBuffer.push(this.npdu.toBuffer());
        return Buffer.concat(msgBuffer);
    }
}
exports.LDataCon = LDataCon;
//# sourceMappingURL=LDataCon.js.map