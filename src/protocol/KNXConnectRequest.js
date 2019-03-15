"use strict";
const KNXPacket = require("./KNXPacket");
const {Buffer} = require("buffer");
const KNX_CONSTANTS = require("./KNXConstants");
const HPAI = require("./HPAI");
const CRIFactory = require("./CRIFactory");

class KNXConnectRequest extends KNXPacket {
    /**
     *
     * @param {CRI} cri
     * @param {HPAI} hpaiControl=HPAI.NULLHPAI
     * @param {HPAI} hpaiData=HPAI.NULLHPAI
     */
    constructor(cri, hpaiControl = HPAI.NULLHPAI, hpaiData = HPAI.NULLHPAI) {
        super(KNX_CONSTANTS.CONNECT_REQUEST, hpaiControl.length + hpaiData.length + cri.length);
        this.hpaiControl = hpaiControl;
        this.hpaiData = hpaiData;
        this.cri = cri;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        return Buffer.concat([
            this.header.toBuffer(),
            this.hpaiControl.toBuffer(),
            this.hpaiData.toBuffer(),
            this.cri.toBuffer()]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXConnectRequest}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const hpaiControl = HPAI.fromBuffer(buffer, offset);
        offset += hpaiControl.length;
        const hpaiData = HPAI.fromBuffer(buffer, offset);
        offset += hpaiData.length;
        const cri = CRIFactory.fromBuffer(buffer, offset);
        return new KNXConnectRequest(cri, hpaiControl, hpaiData);
    }
}

module.exports = KNXConnectRequest;
