'use strict';
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTScene extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT1.id, DataPointType_1.DataPointType.TYPES.DPT1.subtypes.scene, DataPointType_1.DataPointType.TYPES.DPT1.encoder, DataPointType_1.DataPointType.TYPES.DPT1.decoder);
    }
};
//# sourceMappingURL=DPTScene.js.map