'use strict';
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTDate extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT11.id, DataPointType_1.DataPointType.TYPES.DPT11.subtypes.date, DataPointType_1.DataPointType.TYPES.DPT11.encoder, DataPointType_1.DataPointType.TYPES.DPT11.decoder);
    }
};
//# sourceMappingURL=DPTDate.js.map