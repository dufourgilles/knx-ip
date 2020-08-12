"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Speed = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Speed extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTSpeed);
    }
}
exports.Speed = Speed;
//# sourceMappingURL=Speed.js.map