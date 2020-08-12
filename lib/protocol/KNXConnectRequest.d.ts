/// <reference types="node" />
import { KNXPacket } from './KNXPacket';
import { HPAI } from './HPAI';
import { CRI } from './CRI';
export declare class KNXConnectRequest extends KNXPacket {
    readonly cri: CRI;
    readonly hpaiControl: HPAI;
    readonly hpaiData: HPAI;
    constructor(cri: CRI, hpaiControl?: HPAI, hpaiData?: HPAI);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXConnectRequest;
    toBuffer(): Buffer;
}
