"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Updown = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Updown extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTUpdown);
    }
}
exports.Updown = Updown;
//# sourceMappingURL=Updown.js.map