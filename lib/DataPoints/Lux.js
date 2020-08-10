"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lux = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Lux extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTLux);
    }
}
exports.Lux = Lux;
//# sourceMappingURL=Lux.js.map