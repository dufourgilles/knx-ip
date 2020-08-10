'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CEMIFactory = void 0;
const CEMIConstants_1 = require("./CEMIConstants");
const LDataInd_1 = require("./LDataInd");
const LDataCon_1 = require("./LDataCon");
const LDataReq_1 = require("./LDataReq");
const ControlField_1 = require("./ControlField");
const NPDU_1 = require("./NPDU");
class CEMIFactory {
    static createFromBuffer(type, buffer, offset) {
        switch (type) {
            case CEMIConstants_1.CEMIConstants.L_DATA_IND:
                return LDataInd_1.LDataInd.createFromBuffer(buffer, offset);
            case CEMIConstants_1.CEMIConstants.L_DATA_CON:
                return LDataCon_1.LDataCon.createFromBuffer(buffer, offset);
            case CEMIConstants_1.CEMIConstants.L_DATA_REQ:
                return LDataReq_1.LDataReq.createFromBuffer(buffer, offset);
            default:
                throw new Error(`Unsupported type cEMI message type ${type}`);
        }
    }
    static newLDataIndicationMessage(isGroupAddress, srcAddress, dstAddress, data) {
        const controlField = new ControlField_1.ControlField();
        controlField.addressType = isGroupAddress === true ? 1 : 0;
        controlField.ack = 0;
        const npdu = new NPDU_1.NPDU();
        npdu.tpci = NPDU_1.NPDU.TPCI_UNUMBERED_PACKET;
        npdu.action = NPDU_1.NPDU.GROUP_WRITE;
        npdu.data = data;
        return new LDataInd_1.LDataInd(null, controlField, srcAddress, dstAddress, npdu);
    }
    static newLDataRequestMessage(isWrite, isGroupAddress, srcAddress, dstAddress, data) {
        const controlField = new ControlField_1.ControlField();
        controlField.addressType = isGroupAddress ? 1 : 0;
        controlField.ack = isWrite ? 1 : 0;
        const npdu = new NPDU_1.NPDU();
        npdu.tpci = NPDU_1.NPDU.TPCI_UNUMBERED_PACKET;
        npdu.action = isWrite ? NPDU_1.NPDU.GROUP_WRITE : NPDU_1.NPDU.GROUP_READ;
        npdu.data = data;
        return new LDataReq_1.LDataReq(null, controlField, srcAddress, dstAddress, npdu);
    }
    static newLDataConfirmationMessage(isGroupAddress, srcAddress, dstAddress, data) {
        const controlField = new ControlField_1.ControlField();
        controlField.addressType = isGroupAddress === true ? 1 : 0;
        controlField.ack = 0;
        const npdu = new NPDU_1.NPDU();
        npdu.tpci = NPDU_1.NPDU.TPCI_UNUMBERED_PACKET;
        npdu.action = NPDU_1.NPDU.GROUP_WRITE;
        npdu.data = data;
        return new LDataReq_1.LDataReq(null, controlField, srcAddress, dstAddress, npdu);
    }
}
exports.CEMIFactory = CEMIFactory;
//# sourceMappingURL=CEMIFactory.js.map