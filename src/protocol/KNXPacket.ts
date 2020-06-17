'use strict';
import {KNXHeader} from './KNXHeader';

export class KNXPacket {
    private _header: KNXHeader;
    constructor(readonly type: number, readonly length: number) {
            this._header = new KNXHeader(
            type,
            length
        );
        this.type = type;
        this.length = length;
    }

    get header(): KNXHeader {
        return this._header;
    }

    toBuffer(): Buffer {
        return Buffer.alloc(0);
    }
}
