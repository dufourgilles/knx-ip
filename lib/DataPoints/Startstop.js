"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startstop = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Startstop extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTStartstop);
    }
}
exports.Startstop = Startstop;
//# sourceMappingURL=Startstop.js.map