"use strict";

class DIB {
    constructor(type) {
        this._type = type;
    }

    get type() {
        return this._type;
    }

    static fromBuffer(buffer, offset = 0) {

    }
}

module.exports = DIB;
