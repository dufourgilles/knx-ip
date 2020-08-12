"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Percentagescaling = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
const MIN = 0;
const MAX = 255;
class Percentagescaling extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTPercentagescaling);
        this._actions = {
            'set': {
                func: this.set.bind(this),
                parameterType: {
                    type: 'integer',
                    min: MIN,
                    max: MAX
                }
            }
        };
    }
    set(_value) {
        const value = Number(_value);
        if ((value < MIN) || (value > MAX)) {
            throw new Error(`Invalid value ${value}`);
        }
        this.write(value);
    }
}
exports.Percentagescaling = Percentagescaling;
//# sourceMappingURL=Percentagescaling.js.map