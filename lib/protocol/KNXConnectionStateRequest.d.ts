/// <reference types="node" />
import { KNXPacket } from './KNXPacket';
import { HPAI } from './HPAI';
export declare class KNXConnectionStateRequest extends KNXPacket {
    readonly channelID: number;
    readonly hpaiControl: HPAI;
    constructor(channelID: number, hpaiControl?: HPAI);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXConnectionStateRequest;
    toBuffer(): Buffer;
}
