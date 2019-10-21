"use strict";

class KNXDataBuffer {
    /**
     * 
     * @param {Buffer} data 
     * @param {DataPoint} info=null
     */
    constructor(data, info=null) {
        this._data = data;
        /** @type {DataPoint} */
        this._info = info;
    }

    get length() {
        return this._data == null ? 0 : this._data.length;
    }

    get value() {
        return this._data;
    }

    get info() {
        return this._info;
    }

    sixBits() {
        if (this.info == null) { return true;}
        return this.info.type.type === "1";
    }
}

module.exports = KNXDataBuffer;
