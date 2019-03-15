"use strict";
const DIB = require("./DIB");
const KNX_CONSTANTS = require("./KNXConstants");


class ServiceFamilies extends DIB {
    /**
     *
     */
    constructor() {
        super(KNX_CONSTANTS.SUPP_SVC_FAMILIES);
        this._services = new Map();
    }

    /**
     *
     * @returns {number}
     */
    get length() {
        return 2 * this._services.size + 2;
    }

    /**
     *
     * @returns {Map<number, number>}
     */
    get services() {
        return this._services;
    }

    /**
     *
     * @param {number} id
     * @param {number} version
     */
    set(id, version) {
        const _id = Number(id);
        if (isNaN(_id) || id > 0xFF || id < 0) {
            throw new Error("Invalid service id");
        }
        const _version = Number(version);
        if (isNaN(_version) || version > 0xFF || version < 0) {
            throw new Error("Invalid service version")
        }
        this._services.set(id, version);
    }

    /**
     *
     * @param {number} id
     * @returns {number} service version
     */
    service(id) {
        return this._services.get(id);
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(KNX_CONSTANTS.SUPP_SVC_FAMILIES, offset++);
        for([id, version] of this._services) {
            buffer.writeUInt8(id, offset++);
            buffer.writeUInt8(version,offset++);
        }
        return buffer;
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {ServiceFamilies}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error(`offset ${offset} block length: ${structureLength} out of buffer range ${buffer.length}`);
        }
        offset++;
        const type = buffer.readUInt8(offset++);
        if (type != KNX_CONSTANTS.SUPP_SVC_FAMILIES) {
            throw new Error(`Invalid Service Family type ${type}`);
        }
        const serviceFamily  = new ServiceFamilies();
        for(let i = 2; i < structureLength; i += 2) {
            serviceFamily.set(buffer.readUInt8(offset), buffer.readUInt8(offset + 1));
            offset += 2;
        }
        return serviceFamily;
    }


}

module.exports = ServiceFamilies;
