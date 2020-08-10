"use strict";
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
module.exports = class Switch extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTSwitch);
        this._actions = {
            'off': { func: this.setOff.bind(this), parameterType: null },
            'on': { func: this.setOn.bind(this), parameterType: null }
        };
    }
    setOff() {
        this.write(0);
    }
    setOn() {
        this.write(1);
    }
};
//# sourceMappingURL=Switch.js.map