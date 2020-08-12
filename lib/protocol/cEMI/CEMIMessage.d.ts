/// <reference types="node" />
import { KNXDataBuffer } from '../KNXDataBuffer';
import { ControlField } from './ControlField';
import { KNXAddress } from '../KNXAddress';
import { NPDU } from './NPDU';
export declare class CEMIMessage {
    readonly msgCode: number;
    readonly length: number;
    readonly additionalInfo: KNXDataBuffer;
    readonly control: ControlField;
    readonly srcAddress: KNXAddress;
    readonly dstAddress: KNXAddress;
    readonly npdu: NPDU;
    constructor(msgCode: number, length: number, additionalInfo: KNXDataBuffer, control: ControlField, srcAddress: KNXAddress, dstAddress: KNXAddress, npdu: NPDU);
    toBuffer(): Buffer;
    protected static GetLength(additionalInfo: KNXDataBuffer, control: ControlField, srcAddress: KNXAddress, dstAddress: KNXAddress, npdu: NPDU): number;
}
