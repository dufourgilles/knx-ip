'use strict';
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTTime extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT10.id, DataPointType_1.DataPointType.TYPES.DPT10.subtypes.time, DataPointType_1.DataPointType.TYPES.DPT10.encoder, DataPointType_1.DataPointType.TYPES.DPT10.decoder);
    }
};
//# sourceMappingURL=DPTTime.js.map