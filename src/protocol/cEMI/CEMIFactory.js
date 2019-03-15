"use strict";
const CEMIConstants = require("./CEMIConstants");
const LDataInd = require("./LDataInd");
const LDataReq = require("./LDataReq");
const LDataCon = require("./LDataCon");
const ControlField = require("./ControlField");
const NPDU = require("./NPDU");

class CEMIFactory {
    /**
     *
     * @param {number} type - message type
     * @param {Buffer} buffer
     * @param {number} offset
     * @returns {CEMIMessage}
     */
    static fromBuffer(type, buffer, offset) {
        switch(type) {
            case CEMIConstants.L_DATA_IND:
                return LDataInd.fromBuffer(buffer, offset);
            case CEMIConstants.L_DATA_CON:
                return LDataCon.fromBuffer(buffer, offset);
            case CEMIConstants.L_DATA_REQ:
                return LDataReq.fromBuffer(buffer, offset);
            default:
                throw new Error(`Unsupported type cEMI message type ${type}`);
                break;
        }
    }

    /**
     *
     * @param {boolean} isGroupAddress
     * @param {KNXAddress} srcAddress
     * @param {KNXAddress} dstAddress
     * @param {Buffer} data
     * @returns {LDataInd}
     */
    static newLDataIndicationMessage(isGroupAddress, srcAddress, dstAddress, data) {
        const controlField = new ControlField();
        controlField.addressType = isGroupAddress === true ?  1 : 0;
        controlField.ack = 0;
        const npdu = new NPDU();
        npdu.tpci = NPDU.TPCI_UNUMBERED_PACKET;
        npdu.action = NPDU.GROUP_WRITE;
        npdu.data = data;
        return new LDataInd(null, controlField, srcAddress, dstAddress, npdu)
    }

    /**
     *
     * @param {boolean} isWrite
     * @param {boolean} isGroupAddress
     * @param {KNXAddress} srcAddress
     * @param {KNXAddress} dstAddress
     * @param {Buffer} data
     * @returns {LDataInd}
     */
    static newLDataRequestMessage(isWrite, isGroupAddress, srcAddress, dstAddress, data) {
        const controlField = new ControlField();
        controlField.addressType = isGroupAddress ?  1 : 0;
        controlField.ack = isWrite ? 1 : 0;
        const npdu = new NPDU();
        npdu.tpci = NPDU.TPCI_UNUMBERED_PACKET;
        npdu.action = isWrite ? NPDU.GROUP_WRITE : NPDU.GROUP_READ;
        npdu.data = data;
        return new LDataReq(null, controlField, srcAddress, dstAddress, npdu)
    }

    /**
     *
     * @param {boolean} isGroupAddress
     * @param {KNXAddress} srcAddress
     * @param {KNXAddress} dstAddress
     * @param {Buffer} data
     * @returns {LDataInd}
     */
    static newLDataConfirmationMessage(isGroupAddress, srcAddress, dstAddress, data) {
        const controlField = new ControlField();
        controlField.addressType = isGroupAddress === true ?  1 : 0;
        controlField.ack = 0;
        const npdu = new NPDU();
        npdu.tpci = NPDU.TPCI_UNUMBERED_PACKET;
        npdu.action = NPDU.GROUP_WRITE;
        npdu.data = data;
        return new LDataReq(null, controlField, srcAddress, dstAddress, npdu)
    }
}

module.exports = CEMIFactory;
