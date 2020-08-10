'use strict';
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
const MIN = 0;
const MAX = 100;
module.exports = class Percentage extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTPercentage);
        this._actions = {
            'set': {
                func: this.set.bind(this),
                parameterType: {
                    type: 'integer',
                    min: MIN,
                    max: MAX,
                    default: MIN
                }
            }
        };
    }
    set(param) {
        if ((param == null) || (param.value == null)) {
            throw new Error('Invalid parameter received for set. Expecting {value: number} ');
        }
        const value = Number(param.value);
        if ((value < MIN) || (value > MAX)) {
            throw new Error(`Invalid value ${value}`);
        }
        this.write(value);
    }
};
//# sourceMappingURL=Percentage.js.map