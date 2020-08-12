"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Temperature = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Temperature extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTTemperature);
    }
}
exports.Temperature = Temperature;
//# sourceMappingURL=Temperature.js.map