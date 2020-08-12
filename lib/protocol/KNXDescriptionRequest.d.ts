/// <reference types="node" />
import { KNXPacket } from './KNXPacket';
import { HPAI } from './HPAI';
export declare class KNXDescriptionRequest extends KNXPacket {
    readonly hpai: HPAI;
    constructor(hpai: HPAI);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXDescriptionRequest;
    toBuffer(): Buffer;
}
