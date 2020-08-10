/// <reference types="node" />
import { KNXPacket } from './KNXPacket';
import { ConnectionStatus } from './KNXConstants';
export declare class KNXDisconnectResponse extends KNXPacket {
    readonly channelID: number;
    readonly status: ConnectionStatus;
    constructor(channelID: number, status: ConnectionStatus);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXDisconnectResponse;
    toBuffer(): Buffer;
}
