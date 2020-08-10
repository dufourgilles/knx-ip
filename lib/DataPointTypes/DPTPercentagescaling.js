'use strict';
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTPercentagescaling extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT5.id, DataPointType_1.DataPointType.TYPES.DPT5.subtypes.percentagescaling, DataPointType_1.DataPointType.TYPES.DPT5.encoder, DataPointType_1.DataPointType.TYPES.DPT5.decoder);
    }
};
//# sourceMappingURL=DPTPercentagescaling.js.map