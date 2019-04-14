"use strict";

const DataPoint = require("./DataPoint");
const DPTPercentagescaling = require("../DataPointTypes/DPTPercentagescaling");

const MIN = 0;
const MAX = 255;

class Percentagescaling extends DataPoint {
    constructor(ga) {
        super(ga, DPTPercentagescaling);

        this._actions = {
            "set": {
                func: this.set.bind(this),
                paramterType: {
                    type: "integer",
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

module.exports = Percentagescaling;