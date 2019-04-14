"use strict";

/*
    // 5.001 percentage (0=0..ff=100%)
    "001" : {
        "name" : "DPT_Scaling", "desc" : "percent",
        "unit" : "%", "scalar_range" : [0, 100]
    },
 */
const DataPoint = require("./DataPoint");
const DPTPerentage = require("../DataPointTypes/DPTPercentage");

const MIN = 0;
const MAX = 100;

class Percentage extends DataPoint {
    constructor(ga) {
        super(ga, DPTPerentage);

        this._actions = {
            "set": {
                func: this.set.bind(this),
                parameterType: {
                    type: "integer",
                    min: MIN,
                    max: MAX,
                    default: MIN
                }
            }
        };
    }

    set(param) {
        if ((param == null) || (param.value == null)) {
            throw new Error("Invalid parameter received for set. Expecting {value: number} ");
        }
        const value = Number(param.value);
        if ((value < MIN) || (value > MAX)) {
            throw new Error(`Invalid value ${value}`);
        }
        this.write(value);
    }
}

module.exports = Percentage;