/// <reference types="node" />
import { KNXPacket } from './KNXPacket';
import { DeviceInfo } from './DeviceInfo';
import ServiceFamilies from './ServiceFamilies';
import { HPAI } from './HPAI';
export declare class KNXSearchResponse extends KNXPacket {
    readonly hpai: HPAI;
    readonly deviceInfo: DeviceInfo;
    readonly serviceFamilies: ServiceFamilies;
    constructor(hpai: HPAI, deviceInfo: DeviceInfo, serviceFamilies: ServiceFamilies);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXSearchResponse;
    toBuffer(): Buffer;
}
