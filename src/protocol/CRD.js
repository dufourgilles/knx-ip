"use strict";
const KNX_CONSTANTS = require("./KNXConstants");
const KNXAddress = require("./KNXAddress");
const CRD_LENGTH = 4;

class CRD {
    /**
     *
     * @param {number} connectionType
     * @param {string|number|KNXAddress} knxAddress
     */
    constructor(connectionType, knxAddress) {
        this.connectionType = connectionType;
        this.knxAddress = knxAddress;
    }

    /**
     *
     * @param {string|number|KNXAddress} address
     */
    set knxAddress(knxAddress) {
        if (knxAddress instanceof KNXAddress) {
            this._knxAddress = knxAddress;
        }
        else {
            this._knxAddress = new KNXAddress(knxAddress);
        }
    }

    /**
     *
     * @returns {KNXAddress}
     */
    get knxAddress() {
        return this._knxAddress;
    }

    /**
     *
     * @returns {number}
     */
    get length() {
        return CRD_LENGTH;
    }

    /**
     *
     * @param {number} connectionType
     */
    set connectionType(connectionType) {
        const _connectionType = Number(connectionType);
        if (_connectionType !== KNX_CONSTANTS.TUNNEL_CONNECTION &&
            _connectionType !== KNX_CONSTANTS.DEVICE_MGMT_CONNECTION &&
            _connectionType !== REMLOG_CONNECTION &&
            _connectionType !== REMCONF_CONNECTION &&
            _connectionType !== OBJSVR_CONNECTION) {
            throw new Error(`Invalid connection type ${connectionType}`);
        }
        this._connectionType = _connectionType;
    }

    /**
     *
     * @returns {number}
     */
    get connectionType() {
        return this._connectionType;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(this.connectionType, offset++);
        buffer.writeUInt16BE(this.knxAddress.get(), offset);
        return buffer;
    }

    /**
     *
     * @param buffer
     * @param offset
     * @returns {CRD}
     */
    static fromBuffer(buffer, offset) {
        if (offset >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error("Buffer too short");
        }
        offset += 1;
        const connectionType =  buffer.readUInt8(offset++);
        const knxAddress = buffer.readUInt16BE(offset);
        return new CRD(connectionType, knxAddress);
    }
}

module.exports = CRD;

