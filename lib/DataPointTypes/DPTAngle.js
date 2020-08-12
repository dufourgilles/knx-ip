'use strict';
const DataPointType_1 = require("./DataPointType");
module.exports = class DPTAngle extends DataPointType_1.DataPointType {
    constructor() {
        super(DataPointType_1.DataPointType.TYPES.DPT14.id, DataPointType_1.DataPointType.TYPES.DPT14.subtypes.angle, DataPointType_1.DataPointType.TYPES.DPT14.encoder, DataPointType_1.DataPointType.TYPES.DPT14.decoder);
    }
};
//# sourceMappingURL=DPTAngle.js.map