'use strict';
import {DIB} from './DIB';
import {KNX_CONSTANTS} from './KNXConstants';

export = class ServiceFamilies implements DIB {

    get type(): number {
        return this._type;
    }

    get length(): number {
        return 2 * this._services.size + 2;
    }

    get services(): Map<number, number> {
        return this._services;
    }
    private _type: number;
    private _services: Map<number, number>;
    constructor() {
        this._type = KNX_CONSTANTS.SUPP_SVC_FAMILIES;
        this._services = new Map();
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): ServiceFamilies {
        if (offset >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error(`offset ${offset} block length: ${structureLength} out of buffer range ${buffer.length}`);
        }
        offset++;
        const type = buffer.readUInt8(offset++);
        if (type !== KNX_CONSTANTS.SUPP_SVC_FAMILIES) {
            throw new Error(`Invalid Service Family type ${type}`);
        }
        const serviceFamily  = new ServiceFamilies();
        for (let i = 2; i < structureLength; i += 2) {
            serviceFamily.set(buffer.readUInt8(offset), buffer.readUInt8(offset + 1));
            offset += 2;
        }
        return serviceFamily;
    }

    set(id: number, version: number): void {
        const _id = Number(id);
        if (isNaN(_id) || id > 0xFF || id < 0) {
            throw new Error('Invalid service id');
        }
        const _version = Number(version);
        if (isNaN(_version) || version > 0xFF || version < 0) {
            throw new Error('Invalid service version');
        }
        this._services.set(id, version);
    }

    service(id: number): number {
        return this._services.get(id);
    }

    toBuffer(): Buffer {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(KNX_CONSTANTS.SUPP_SVC_FAMILIES, offset++);
        for (const [id, version] of this._services) {
            buffer.writeUInt8(id, offset++);
            buffer.writeUInt8(version, offset++);
        }
        return buffer;
    }
};
