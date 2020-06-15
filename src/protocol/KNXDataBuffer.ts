'use strict';

import { IDataPoint } from '../DataPoints/DataPointInterface';

export = class KNXDataBuffer {
    /**
     *
     * @param {Buffer} data
     * @param {IDataPoint} info=null
     */
    constructor(private _data: Buffer, private _info?: IDataPoint) {
    }

    get length(): number {
        return this._data == null ? 0 : this._data.length;
    }

    get value(): Buffer {
        return this._data;
    }

    get info(): IDataPoint|null {
        return this._info;
    }

    sixBits(): boolean {
        if (this.info == null) { return true; }
        return this.info.type.type === '1';
    }
};
