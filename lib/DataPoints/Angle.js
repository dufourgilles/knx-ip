'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angle = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Angle extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTAngle);
    }
}
exports.Angle = Angle;
//# sourceMappingURL=Angle.js.map