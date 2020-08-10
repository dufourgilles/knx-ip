"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Time extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTTime);
    }
}
exports.Time = Time;
//# sourceMappingURL=Time.js.map