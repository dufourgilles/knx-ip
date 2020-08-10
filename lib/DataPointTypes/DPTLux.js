'use strict';
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTLux extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT9.id, DataPointType_1.DataPointType.TYPES.DPT9.subtypes.lux, DataPointType_1.DataPointType.TYPES.DPT9.encoder, DataPointType_1.DataPointType.TYPES.DPT9.decoder);
    }
};
//# sourceMappingURL=DPTLux.js.map