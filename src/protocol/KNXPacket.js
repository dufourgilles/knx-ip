"use strict";
const KNXHeader = require("./KNXHeader");

class KNXPacket {
    /**
     *
     * @param {number} type
     * @param {number} length
     */
    constructor(type, length) {
        this._header = new KNXHeader(
            type,
            KNXHeader.length + length
        );
        this.type = type;
        this.length = length;
    }

    /**
     *
     * @returns {KNXHeader}
     */
    get header() {
        return this._header;
    }
}

module.exports = KNXPacket;
