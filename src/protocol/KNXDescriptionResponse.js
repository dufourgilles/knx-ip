"use strict";
const KNX_CONSTANTS = require("./KNXConstants");
const KNXPacket = require("./KNXPacket");
const DeviceInfo = require("./DeviceInfo");
const ServiceFamilies = require("./ServiceFamilies");
const {Buffer} = require("buffer");

class KNXDescriptionResponse extends KNXPacket{
    /**
     *
     * @param {DeviceInfo} deviceInfo
     * @param {ServiceFamilies} serviceFamilies
     */
    constructor(deviceInfo, serviceFamilies) {
        super(KNX_CONSTANTS.DESCRIPTION_RESPONSE, deviceInfo.length + serviceFamilies.length);
        this.deviceInfo = deviceInfo;
        this.serviceFamilies = serviceFamilies;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        return Buffer.concat([
            this.header.toBuffer(),
            this.deviceInfo.toBuffer(),
            this.serviceFamilies.toBuffer()
        ]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXDescriptionResponse}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset + this.length >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const deviceInfo = DeviceInfo.fromBuffer(buffer, offset);
        offset += deviceInfo.length;
        const serviceFamilies = ServiceFamilies.fromBuffer(buffer, offset);
        return new KNXDescriptionResponse(deviceInfo, serviceFamilies);
    }
}

module.exports = KNXDescriptionResponse;
