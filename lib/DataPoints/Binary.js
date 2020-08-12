"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Binary = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Binary extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTBinary);
    }
}
exports.Binary = Binary;
//# sourceMappingURL=Binary.js.map