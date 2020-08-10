"use strict";
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTDimmingcontrol extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT3.id, DataPointType_1.DataPointType.TYPES.DPT3.subtypes.dimmingcontrol, DataPointType_1.DataPointType.TYPES.DPT3.encoder, DataPointType_1.DataPointType.TYPES.DPT3.decoder);
    }
};
//# sourceMappingURL=DPTDimmingcontrol.js.map