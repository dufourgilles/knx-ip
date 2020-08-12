'use strict';
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTPercentage extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT5.id, DataPointType_1.DataPointType.TYPES.DPT5.subtypes.percentage, DataPointType_1.DataPointType.TYPES.DPT5.encoder, (buffer) => DataPointType_1.DataPointType.TYPES.DPT5.decoder(buffer) / 2.55);
    }
};
//# sourceMappingURL=DPTPercentage.js.map