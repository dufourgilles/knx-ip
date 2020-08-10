/// <reference types="node" />
import { KNXPacket } from './KNXPacket';
import { DeviceInfo } from './DeviceInfo';
import ServiceFamilies from './ServiceFamilies';
export declare class KNXDescriptionResponse extends KNXPacket {
    readonly deviceInfo: DeviceInfo;
    readonly serviceFamilies: ServiceFamilies;
    constructor(deviceInfo: DeviceInfo, serviceFamilies: ServiceFamilies);
    static createFromBuffer(buffer: Buffer, offset?: number): KNXDescriptionResponse;
    toBuffer(): Buffer;
}
