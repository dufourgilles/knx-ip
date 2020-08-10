'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dimmingcontrol = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Dimmingcontrol extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTDimmingcontrol);
    }
}
exports.Dimmingcontrol = Dimmingcontrol;
//# sourceMappingURL=Dimmingcontrol.js.map