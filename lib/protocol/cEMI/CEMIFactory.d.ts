/// <reference types="node" />
import { KNXAddress } from '../KNXAddress';
import { CEMIMessage } from './CEMIMessage';
import { LDataInd } from './LDataInd';
import { LDataReq } from './LDataReq';
import { KNXDataBuffer } from '../KNXDataBuffer';
export declare class CEMIFactory {
    static createFromBuffer(type: number, buffer: Buffer, offset: number): CEMIMessage;
    static newLDataIndicationMessage(isGroupAddress: boolean, srcAddress: KNXAddress, dstAddress: KNXAddress, data: KNXDataBuffer): LDataInd;
    static newLDataRequestMessage(isWrite: boolean, isGroupAddress: boolean, srcAddress: KNXAddress, dstAddress: KNXAddress, data: KNXDataBuffer): LDataReq;
    static newLDataConfirmationMessage(isGroupAddress: boolean, srcAddress: KNXAddress, dstAddress: KNXAddress, data: KNXDataBuffer): LDataReq;
}
