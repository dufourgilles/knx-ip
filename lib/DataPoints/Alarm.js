'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alarm = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Alarm extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTAlarm);
    }
}
exports.Alarm = Alarm;
//# sourceMappingURL=Alarm.js.map