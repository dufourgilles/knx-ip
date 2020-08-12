"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enable = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Enable extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTEnable);
    }
}
exports.Enable = Enable;
//# sourceMappingURL=Enable.js.map