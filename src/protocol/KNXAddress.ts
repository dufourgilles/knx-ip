'use strict';

import {validateKNXAddress} from './KNXUtils';
const ADDRESS_LENGTH = 2;

export enum KNXAddressType {
    TYPE_INDIVIDUAL = 0,
    TYPE_GROUP = 1
}

export enum KNXAddressLevel {
    LEVEL_TWO = 2,
    LEVEL_THREE = 3
}

export class KNXAddress {
    readonly length: number;
    private _address: number;

    constructor(address: number,
        readonly type: KNXAddressType = KNXAddressType.TYPE_INDIVIDUAL,
        readonly level: KNXAddressLevel = KNXAddressLevel.LEVEL_THREE) {

        this.set(address);
        this.length = ADDRESS_LENGTH;
    }

    static get TYPE_INDIVIDUAL(): KNXAddressType {
        return KNXAddressType.TYPE_INDIVIDUAL;
    }

    static get TYPE_GROUP(): KNXAddressType {
        return KNXAddressType.TYPE_GROUP;
    }

    static createFromString(address: string|number, type: KNXAddressType = KNXAddressType.TYPE_INDIVIDUAL): KNXAddress {
        return new KNXAddress(validateKNXAddress(address, type === KNXAddressType.TYPE_GROUP), type);
    }

    static createFromBuffer(buffer: Buffer, offset = 0, type: KNXAddressType = KNXAddressType.TYPE_INDIVIDUAL): KNXAddress {
        if (offset + ADDRESS_LENGTH >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const address = buffer.readUInt16BE(offset);
        return new KNXAddress(address, type);
    }

    set(address: number): void {
        if (isNaN(address)) {
            throw new Error('Invalid address format');
        } else if (address > 0xFFFF) {
            throw new Error('Invalid address number');
        } else {
            this._address = address;
        }
    }

    get(): number {
        return this._address;
    }

    toString(): string {
        const digits = [];
        if (this.level === KNXAddressLevel.LEVEL_TWO) {
            digits.push((this._address >> 8) & 0xFF);
            digits.push(this._address & 0xFF);
        } else {
            if (this._address > 0x7FF) {
                if (this.type === KNXAddressType.TYPE_GROUP) {
                    digits.push((this._address >> 11) & 0x1F);
                } else {
                    digits.push((this._address >> 12) & 0x0F);
                }
            }
            if (this.type === KNXAddressType.TYPE_GROUP) {
                digits.push((this._address >> 8) & 0x07);
            } else {
                digits.push((this._address >> 8) & 0x0F);
            }
        }
        digits.push(this._address & 0xFF);
        return digits.join('.');
    }

    toBuffer(): Buffer {
        const buffer = Buffer.alloc(this.length);
        buffer.writeUInt16BE(this._address, 0);
        return buffer;
    }
}
