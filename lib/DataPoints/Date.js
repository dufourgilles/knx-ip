"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Date = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Date extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTDate);
    }
}
exports.Date = Date;
//# sourceMappingURL=Date.js.map