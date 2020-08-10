"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scenecontrol = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Scenecontrol extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTScenecontrol);
    }
}
exports.Scenecontrol = Scenecontrol;
//# sourceMappingURL=Scenecontrol.js.map