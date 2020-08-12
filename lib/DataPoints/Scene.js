"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
class Scene extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTScene);
    }
}
exports.Scene = Scene;
//# sourceMappingURL=Scene.js.map