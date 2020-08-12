'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPointType = void 0;
const DPT1_1 = require("./DPT1");
const DPT2_1 = require("./DPT2");
const DPT3_1 = require("./DPT3");
const DPT5_1 = require("./DPT5");
const DPT9_1 = require("./DPT9");
const DPT10_1 = require("./DPT10");
const DPT11_1 = require("./DPT11");
const DPT14_1 = require("./DPT14");
const DPT18_1 = require("./DPT18");
class DataPointType {
    constructor(_type, _subtype, _encoder, _decoder) {
        this._type = _type;
        this._subtype = _subtype;
        this._encoder = _encoder;
        this._decoder = _decoder;
    }
    get type() {
        return this._type;
    }
    get subtype() {
        return this._subtype;
    }
    static get TYPES() {
        return {
            DPT1: DPT1_1.DPT1,
            DPT2: DPT2_1.DPT2,
            DPT3: DPT3_1.DPT3,
            DPT4: null,
            DPT5: DPT5_1.DPT5,
            DPT6: null,
            DPT7: null,
            DPT8: null,
            DPT9: DPT9_1.DPT9,
            DPT10: DPT10_1.DPT10,
            DPT11: DPT11_1.DPT11,
            DPT12: null,
            DPT13: null,
            DPT14: DPT14_1.DPT14,
            DPT15: null,
            DPT16: null,
            DPT17: null,
            DPT18: DPT18_1.DPT18,
            DPT19: null,
            DPT20: null
        };
    }
    static validType(text) {
        const m = text.toUpperCase().match(/(?:DPT)?(\d+)(\.(\d+))?/);
        return m != null;
    }
    toString() {
        return `${this.type}.${this.subtype}`;
    }
    decode(buffer) {
        return this._decoder(buffer);
    }
    encode(value) {
        return this._encoder(value);
    }
}
exports.DataPointType = DataPointType;
//# sourceMappingURL=DataPointType.js.map