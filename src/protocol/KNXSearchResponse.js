"use strict";
const KNX_CONSTANTS = require("./KNXConstants");
const KNXPacket = require("./KNXPacket");
const DeviceInfo = require("./DeviceInfo");
const ServiceFamilies = require("./ServiceFamilies");
const {Buffer} = require("buffer");
const HPAI = require("./HPAI");

class KNXSearchResponse extends KNXPacket{
    /**
     *
     * @param {HPAI} hpai
     * @param {DeviceInfo} deviceInfo
     * @param {ServiceFamilies} serviceFamilies
     */
    constructor(hpai, deviceInfo, serviceFamilies) {
        super(KNX_CONSTANTS.SEARCH_RESPONSE, hpai.length + deviceInfo.length + serviceFamilies.length);
        this.hpai = hpai;
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
            this.hpai.toBuffer(),
            this.deviceInfo.toBuffer(),
            this.serviceFamilies.toBuffer()
        ]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXSearchResponse}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset + this.length >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const hpai = HPAI.fromBuffer(buffer, offset);
        offset += hpai.length;
        const deviceInfo = DeviceInfo.fromBuffer(buffer, offset);
        offset += deviceInfo.length;
        const serviceFamilies = ServiceFamilies.fromBuffer(buffer, offset);
        return new KNXSearchResponse(hpai, deviceInfo, serviceFamilies);
    }

    static get length() {

    }
}

module.exports = KNXSearchResponse;
