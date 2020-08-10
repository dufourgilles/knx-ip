/// <reference types="node" />
import { KNXPacket } from './KNXPacket';
import { HPAI } from './HPAI';
export declare class KNXDisconnectRequest extends KNXPacket {
    readonly channelID: number;
    readonly hpaiControl: HPAI;
    constructor(channelID: number, hpaiControl?: HPAI);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXDisconnectRequest;
    toBuffer(): Buffer;
}
