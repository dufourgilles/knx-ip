"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Switch extends DataPoint_1.DataPoint {
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
}
exports.Switch = Switch;
//# sourceMappingURL=Switch.js.map