
"use strict";
const KNX_CONSTANTS = require("./KNXConstants");
const CRI = require("./CRI");
const {Buffer} = require("buffer");
const TUNNEL_CRI_LENGTH = 4;

class TunnelCRI extends CRI {
    /**
     * @param {number|string} knxLayer="TUNNEL_LINKLAYER"
     */
    constructor(knxLayer = "TUNNEL_LINKLAYER") {
        super(KNX_CONSTANTS.TUNNEL_CONNECTION);
        this.knxLayer = knxLayer;
    }

    /**
     *
     * @param {number|string} knxLayer
     */
    set knxLayer(knxLayer) {

        if (typeof(knxLayer) === "string") {
            switch(knxLayer) {
                case "TUNNEL_LINKLAYER":
                    this._knxLayer = KNX_CONSTANTS.TUNNEL_LINKLAYER;
                    break;
                case "TUNNEL_RAW":
                    this._knxLayer = TUNNEL_RAW;
                    break;
                case "TUNNEL_BUSMONITOR":
                    this._knxLayer = TUNNEL_BUSMONITOR;
                    break;
                default:
                    throw new Error(`Unknown knxlayer ${knxLayer}`);
            }
        }
        else {
            const _knxLayer = Number(knxLayer);
            if (_knxLayer !== KNX_CONSTANTS.TUNNEL_LINKLAYER &&
                _knxLayer !== KNX_CONSTANTS.TUNNEL_RAW &&
                _knxLayer !== KNX_CONSTANTS.TUNNEL_BUSMONITOR) {
                throw new Error(`Invalid knx layer ${knxLayer}`);
            }
            this._knxLayer = _knxLayer;
        }
    }

    /**
     *
     * @returns {number}
     */
    get knxLayer() {
        return this._knxLayer
    }

    /**
     *
     * @returns {number}
     */
    get length() {
        return TUNNEL_CRI_LENGTH;
    }

    /**
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(KNX_CONSTANTS.TUNNEL_CONNECTION, offset++);
        buffer.writeUInt8(this.knxLayer, offset++);
        buffer.writeUInt8(0x00, offset);
        return buffer;
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {TunnelCRI}
     */
    static fromBuffer(buffer, offset = 0) {
        const knxLayer = buffer.readUInt8(offset++);
        const reserved = buffer.readUInt8(offset);
        // ignore reserved.
        return new TunnelCRI(knxLayer);
    }
}

module.exports = TunnelCRI;

