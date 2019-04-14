"use strict";

// KNX Specs
// Chapter 3/7/2 Datapoint Types

const DPTYPES = {
    DPT1: require("./DPT1"),
    DPT2: require("./DPT2"),
    DPT3: require("./DPT3"),
    DPT4: "4",
    DPT5: require("./DPT5"),
    DPT6: "6",
    DPT7: "7",
    DPT8: "8",
    DPT9: require("./DPT9"),
    DPT10: require("./DPT10"),
    DPT11: require("./DPT11"),
    DPT12: "12",
    DPT13: "13",
    DPT14: require("./DPT14"),
    DPT15: "15",
    DPT16: "16",
    DPT17: "17",
    DPT18: require("./DPT18"),
    DPT19: "19",
    DPT20: "20"
};

class DataPointType {
    /**
     *
     * @param {strin} type
     * @param {string} subtype - 001
     * @param {function} encoder
     * @param {function} decoder
     */
    constructor(type, subtype, encoder, decoder) {
        this._type = type;
        this._subtype = subtype;
        this._encoder = encoder;
        this._decoder = decoder;
    }

    /**
     *
     * @returns {string}
     */
    get type() {
        return this._type;
    }

    /**
     *
     * @returns {*}
     */
    get subtype() {
        return this._subtype;
    }

    /**
     *
     * @returns {string}
     */
    toString() {
        return `${this.type}.${this.subtype}`;
    }

    /**
     *
     * @param {Buffer} buffer
     * @returns {string|number}
     */
    decode(buffer) {
        return this._decoder(buffer);
    }

    /**
     *
     * @param {string|number} value
     * @returns {Buffer}
     */
    encode(value) {
        return this._encoder(value);
    }

    /**
     *
     * @returns {{DPT1: {id, subtypes}, DPT2: {id, subtypes}, DPT3: {id, subtypes}, DPT4: string, DPT5: {id, subtypes}, DPT6: string, DPT7: string, DPT8: string, DPT9: {id, subtypes}, DPT10: {id, subtypes}, DPT11: {id, subtypes}, DPT12: string, DPT13: string, DPT14: {id, subtypes}, DPT15: string, DPT16: string, DPT17: string, DPT18: string, DPT19: string, DPT20: string}}
     * @constructor
     */
    static get TYPES() {
        return DPTYPES;
    }

    /**
     *
     * @param text
     * @returns {boolean}
     */
    static validType(text) {
        let m = text.toUpperCase().match(/(?:DPT)?(\d+)(\.(\d+))?/);
        return m != null;
    }

    /**
     *
     * @param {string} type
     * @param {string} subtype
     * @returns {string}
     */
    static getDataPointType(type, subtype) {
        const dpt = DPTYPES[`DPT${type}`];
        if (dpt == null) {
            throw new Error(`Unknown type ${type}`);
        }
        let _3digitSubtype = subtype;
        while(_3digitSubtype.length < 3) {
            _3digitSubtype = `0${_3digitSubtype}`;
        }
        const dptSubtype = dpt.subtypes.ids[_3digitSubtype];
        if (dptSubtype == null) {
            throw new Error(`Invalid subtype ${subtype} for type DPT${type}`);
        }
        return dptSubtype;
    }
}

module.exports = DataPointType;