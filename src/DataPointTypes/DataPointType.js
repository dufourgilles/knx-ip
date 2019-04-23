"use strict";

// KNX Specs
// Chapter 3/7/2 Datapoint Types


/**
 * @typedef  {Object} DPTYPE
 * @property {string} id - knx type
 * @property {SUBDPT1|SUBDPT2|SUBDPT3|SUBDPT5|SUBDPT9|SUBDPT10|SUBDPT11|SUBDPT14|SUBDPT18} subtypes
 * @property {Encoder} encoder
 * @property {Decoder} decoder
 */

/**
 * @callback Decoder
 * @param {Buffer} - knx value buffer to decode
 * @returns {Number}
 */

/**
 * @callback Encoder
 * @param {string|Number} - value to encode
 * @returns {Buffer} knx value buffer
 */

class DataPointType {
    /**
     *
     * @param {string} type - a number representing knx datapoint type. ie: 1
     * @param {string} subtype - a number representing knx datapoint subtype. ie: 001
     * @param {Encoder} encoder - a function to encode a value into a valid knx buffer
     * @param {Decoder} decoder - a function to decode a knx buffer into its value.
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
     * @property {DPTYPE}  DPT1
     * @property {DPTYPE}  DPT2
     * @property {DPTYPE}  DPT3
     * @property {DPTYPE}  DPT4
     * @property {DPTYPE}  DPT5
     * @property {DPTYPE}  DPT6
     * @property {DPTYPE}  DPT7
     * @property {DPTYPE}  DPT8
     * @property {DPTYPE}  DPT9
     * @property {DPTYPE}  DPT10
     * @property {DPTYPE}  DPT11
     * @property {DPTYPE}  DPT12
     * @property {DPTYPE}  DPT13
     * @property {DPTYPE}  DPT14
     * @property {DPTYPE}  DPT15
     * @property {DPTYPE}  DPT16
     * @property {DPTYPE}  DPT17
     * @property {DPTYPE}  DPT18
     * @property {DPTYPE}  DPT19
     * @property {DPTYPE}  DPT20
     */
    static get TYPES() {
        return {
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
     * Function to return the name of the datapoint type based on its type and subtype.
     * @param {string|number} type - example 1
     * @param {string|number} subtype - example 5 or 005 for alarm
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