"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Step extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTStep);
    }
}
exports.Step = Step;
//# sourceMappingURL=Step.js.map