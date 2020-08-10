/// <reference types="node" />
import { CEMIMessage } from './CEMIMessage';
import { KNXAddress } from '../KNXAddress';
import { ControlField } from './ControlField';
import { NPDU } from './NPDU';
import { KNXDataBuffer } from '../KNXDataBuffer';
export declare class LDataInd extends CEMIMessage {
    constructor(additionalInfo: KNXDataBuffer, control: ControlField, srcAddress: KNXAddress, dstAddress: KNXAddress, npdu: NPDU);
    static createFromBuffer(buffer: Buffer, offset?: number): LDataInd;
    toBuffer(): Buffer;
}
