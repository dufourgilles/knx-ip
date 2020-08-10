'use strict';
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTScenecontrol extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT18.id, DataPointType_1.DataPointType.TYPES.DPT18.subtypes.scenecontrol, DataPointType_1.DataPointType.TYPES.DPT18.encoder, DataPointType_1.DataPointType.TYPES.DPT18.decoder);
    }
};
//# sourceMappingURL=DPTScenecontrol.js.map