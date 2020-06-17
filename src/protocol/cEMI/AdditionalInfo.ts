'use strict';
import {TLVInfo} from './TLVInfo';

export class AdditionalInfo {
    private _length: number;
    constructor(private _tlvs: TLVInfo[] = []) {
        this._length = 0;
        for (const tlv of _tlvs) {
            this._length += tlv.length;
        }
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): AdditionalInfo {
        /** @type {TLVInfo[]} */
        const tlvs: TLVInfo[] = [];
        const _getOneTLV: () => TLVInfo[] = () => {
            if (offset >= buffer.length) {
                return tlvs;
            }
            const tlv = TLVInfo.createFromBuffer(buffer, offset);
            tlvs.push(tlv);
            offset += tlv.length;
            return _getOneTLV();
        };
        return new AdditionalInfo(_getOneTLV());
    }

    addTLV(tlv: TLVInfo): void {
        this._tlvs.push(tlv);
    }

    toBuffer(): Buffer {
        return Buffer.concat(this._tlvs.map(tlv => tlv.toBuffer()));
    }

}
