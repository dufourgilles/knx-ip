'use strict';
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTUpdown extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT1.id, DataPointType_1.DataPointType.TYPES.DPT1.subtypes.updown, DataPointType_1.DataPointType.TYPES.DPT1.encoder, DataPointType_1.DataPointType.TYPES.DPT1.decoder);
    }
};
//# sourceMappingURL=DPTUpdown.js.map