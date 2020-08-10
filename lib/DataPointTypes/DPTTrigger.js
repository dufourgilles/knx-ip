'use strict';
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTTrigger extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT1.id, DataPointType_1.DataPointType.TYPES.DPT1.subtypes.trigger, DataPointType_1.DataPointType.TYPES.DPT1.encoder, DataPointType_1.DataPointType.TYPES.DPT1.decoder);
    }
};
//# sourceMappingURL=DPTTrigger.js.map