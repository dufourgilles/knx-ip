/// <reference types="node" />
import { KNXPacket } from './KNXPacket';
import { CEMIMessage } from './cEMI/CEMIMessage';
export declare class KNXTunnelingRequest extends KNXPacket {
    readonly channelID: number;
    readonly seqCounter: number;
    readonly cEMIMessage: CEMIMessage;
    constructor(channelID: number, seqCounter: number, cEMIMessage: CEMIMessage);
    static parseCEMIMessage(buffer: Buffer, offset: number): CEMIMessage;
    static createFromBuffer(buffer: Buffer, offset?: number): KNXTunnelingRequest;
    toBuffer(): Buffer;
}
