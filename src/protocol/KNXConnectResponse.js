"use strict";
const KNXPacket = require("./KNXPacket");
const {Buffer} = require("buffer");
const KNX_CONSTANTS = require("./KNXConstants");
const HPAI = require("./HPAI");
const CRD = require("./CRD");

class KNXConnectResponse extends KNXPacket {
    /**
     *
     * @param {number} channelID
     * @param {number} status
     * @param {HPAI} hpai
     * @param {CRD} crd
     */
    constructor(channelID, status, hpai, crd) {
        super(KNX_CONSTANTS.CONNECT_RESPONSE, hpai == null ? 2 : 2 + hpai.length + crd.length);
        this.channelID = channelID;
        this.status = status;
        this.hpai = hpai;
        this.crd = crd;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(this.status, 1);
        if (this.hpai == null) {
            return buffer;
        }
        return Buffer.concat([buffer, this.hpai.toBuffer(), this.crd.toBuffer()]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXConnectResponse}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset + 2 > buffer.length) {
            throw new Error("Buffer too short");
        }
        const channelID = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset++);
        let hpai,crd;
        if (offset < buffer.length) {
            hpai = HPAI.fromBuffer(buffer, offset);
            offset += hpai.length;
            crd = CRD.fromBuffer(buffer, offset);
        }
        return new KNXConnectResponse(channelID, status, hpai, crd);
    }

    /**
     * 
     * @param {number} status 
     * @returns {string}
     */
    static statusToString(status) {
        switch(status) {
            case KNXConstants.E_SEQUENCE_NUMBER:
                return "Invalid Sequence Number";
            case KNXConstants.E_CONNECTION_TYPE:
                return "Invalid Connection Type";
            case KNXConstants.E_CONNECTION_OPTION:
                return "Invalid Connection Option";
            case KNXConstants.E_NO_MORE_CONNECTIONS:
                return "No More Connections";
            case KNXConstants.E_DATA_CONNECTION:
                return "Invalid Data Connection";
            case KNXConstants.E_KNX_CONNECTION:
                return "Invalid KNX Connection";
            case KNXConstants.E_TUNNELING_LAYER:
                return "Invalid Tunneling Layer";
            default:
                return `Unknown error ${status}`;                
        }
    }
}

module.exports = KNXConnectResponse;
