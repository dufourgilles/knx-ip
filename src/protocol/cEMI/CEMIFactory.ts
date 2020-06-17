'use strict';

import { KNXAddress } from '../KNXAddress';

import {CEMIConstants } from './CEMIConstants';
import {CEMIMessage} from './CEMIMessage';
import {LDataInd} from './LDataInd';
import {LDataCon} from './LDataCon';
import {LDataReq} from './LDataReq';
import { ControlField } from './ControlField';
import {NPDU} from './NPDU';
import {KNXDataBuffer} from '../KNXDataBuffer';

export class CEMIFactory {
    /**
     *
     * @param {number} type - message type
     * @param {Buffer} buffer
     * @param {number} offset
     * @returns {CEMIMessage}
     */
    static createFromBuffer(type: number, buffer: Buffer, offset: number): CEMIMessage {
        switch (type) {
            case CEMIConstants.L_DATA_IND:
                return LDataInd.createFromBuffer(buffer, offset);
            case CEMIConstants.L_DATA_CON:
                return LDataCon.createFromBuffer(buffer, offset);
            case CEMIConstants.L_DATA_REQ:
                return LDataReq.createFromBuffer(buffer, offset);
            default:
                throw new Error(`Unsupported type cEMI message type ${type}`);
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
    static newLDataIndicationMessage(isGroupAddress: boolean, srcAddress: KNXAddress, dstAddress: KNXAddress, data: KNXDataBuffer): LDataInd {
        const controlField = new ControlField();
        controlField.addressType = isGroupAddress === true ?  1 : 0;
        controlField.ack = 0;
        const npdu = new NPDU();
        npdu.tpci = NPDU.TPCI_UNUMBERED_PACKET;
        npdu.action = NPDU.GROUP_WRITE;
        npdu.data = data;
        return new LDataInd(null, controlField, srcAddress, dstAddress, npdu);
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
    static newLDataRequestMessage(
        isWrite: boolean,
        isGroupAddress: boolean,
        srcAddress: KNXAddress,
        dstAddress: KNXAddress,
        data: KNXDataBuffer): LDataReq {
        const controlField = new ControlField();
        controlField.addressType = isGroupAddress ?  1 : 0;
        controlField.ack = isWrite ? 1 : 0;
        const npdu = new NPDU();
        npdu.tpci = NPDU.TPCI_UNUMBERED_PACKET;
        npdu.action = isWrite ? NPDU.GROUP_WRITE : NPDU.GROUP_READ;
        npdu.data = data;
        return new LDataReq(null, controlField, srcAddress, dstAddress, npdu);
    }

    /**
     *
     * @param {boolean} isGroupAddress
     * @param {KNXAddress} srcAddress
     * @param {KNXAddress} dstAddress
     * @param {Buffer} data
     * @returns {LDataInd}
     */
    static newLDataConfirmationMessage(isGroupAddress: boolean, srcAddress: KNXAddress, dstAddress: KNXAddress, data: KNXDataBuffer): LDataReq {
        const controlField = new ControlField();
        controlField.addressType = isGroupAddress === true ?  1 : 0;
        controlField.ack = 0;
        const npdu = new NPDU();
        npdu.tpci = NPDU.TPCI_UNUMBERED_PACKET;
        npdu.action = NPDU.GROUP_WRITE;
        npdu.data = data;
        return new LDataReq(null, controlField, srcAddress, dstAddress, npdu);
    }
}
