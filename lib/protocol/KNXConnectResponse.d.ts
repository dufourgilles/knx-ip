/// <reference types="node" />
import { KNXPacket } from './KNXPacket';
import { HPAI } from './HPAI';
import { CRD } from './CRD';
export declare class KNXConnectResponse extends KNXPacket {
    readonly channelID: number;
    readonly status: number;
    readonly hpai: HPAI;
    readonly crd: CRD;
    constructor(channelID: number, status: number, hpai: HPAI, crd: CRD);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXConnectResponse;
    static statusToString(status: number): string;
    toBuffer(): Buffer;
}
