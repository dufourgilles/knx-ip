"use strict";

const DataPointType = require("./DataPointType");

class DPTTime extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT10.id, DataPointType.TYPES.DPT10.subtypes.time,
            DataPointType.TYPES.DPT10.encoder, DataPointType.TYPES.DPT10.decoder);
    }
}

module.exports = new DPTTime();