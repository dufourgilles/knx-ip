'use strict';
import {KNX_CONSTANTS} from './KNXConstants';
import KNXPacket from './KNXPacket';
import {DeviceInfo} from './DeviceInfo';
import ServiceFamilies from './ServiceFamilies';

export = class KNXDescriptionResponse extends KNXPacket {

    constructor(readonly deviceInfo: DeviceInfo, readonly serviceFamilies: ServiceFamilies) {
        super(KNX_CONSTANTS.DESCRIPTION_RESPONSE, deviceInfo.length + serviceFamilies.length);
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): KNXDescriptionResponse {
        if (offset + this.length >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const deviceInfo = DeviceInfo.createFromBuffer(buffer, offset);
        offset += deviceInfo.length;
        const serviceFamilies = ServiceFamilies.createFromBuffer(buffer, offset);
        return new KNXDescriptionResponse(deviceInfo, serviceFamilies);
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer(): Buffer {
        return Buffer.concat([
            this.header.toBuffer(),
            this.deviceInfo.toBuffer(),
            this.serviceFamilies.toBuffer()
        ]);
    }
};
