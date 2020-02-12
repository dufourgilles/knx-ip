'use strict';

import { DataPoint } from '../DataPoints/DataPoint';

export = class KNXDataBuffer {
    /**
     *
     * @param {Buffer} data
     * @param {DataPoint} info=null
     */
    constructor(private _data: Buffer, private _info?: DataPoint) {
    }

    get length(): number {
        return this._data == null ? 0 : this._data.length;
    }

    get value(): Buffer {
        return this._data;
    }

    get info(): DataPoint|null {
        return this._info;
    }

    sixBits(): boolean {
        if (this.info == null) { return true; }
        return this.info.type.type === '1';
    }
};
