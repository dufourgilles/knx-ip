"use strict";
const {Buffer} = require("buffer");
const TLVInfo = require("./TLVInfo");

class AdditionalInfo {
    /**
     *
     * @param {TLVInfo[]} tlvs=[]
     */
    constructor(tlvs = []) {
        this._tlvInfos = tlvs;
        this._length = 0;
        for(let tlv of tlvs) {
            this._length += tlv.length;
        }
    }

    /**
     *
     * @param {TLVInfo} tlv
     */
    addTLV(tlv) {
        this._tlvInfos.push(tlv);
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        return Buffer.concat(this._tlvInfos.map(tlv => tlv.toBuffer()))
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {AdditionalInfo}
     */
    static fromBuffer(buffer, offset = 0) {
        /** @type {TLVInfo[]} */
        const tlvs = [];
        const _getOneTLV = () => {
            if (offset >= buffer.length) {
                return tlvs;
            }
            const tlv = TLVInfo.fromBuffer(buffer, offset);
            tlvs.push(tlv);
            offset += tlv.length;
            return _getOneTLV();
        };
        return new AdditionalInfo(_getOneTLV());
    }

}

module.exports = AdditionalInfo;