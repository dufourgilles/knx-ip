/// <reference types="node" />
import { ConnectionStatus } from './KNXConstants';
import { KNXPacket } from './KNXPacket';
export declare class KNXConnectionStateResponse extends KNXPacket {
    readonly channelID: number;
    readonly status: ConnectionStatus;
    constructor(channelID: number, status: ConnectionStatus);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXConnectionStateResponse;
    toBuffer(): Buffer;
}
