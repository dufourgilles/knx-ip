/// <reference types="node" />
import { KNXPacket } from './KNXPacket';
export declare class KNXTunnelingAck extends KNXPacket {
    readonly channelID: number;
    readonly seqCounter: number;
    readonly status: number;
    constructor(channelID: number, seqCounter: number, status: number);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXTunnelingAck;
    toBuffer(): Buffer;
}
