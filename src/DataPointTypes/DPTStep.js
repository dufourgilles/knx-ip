"use strict";

const DataPointType = require("./DataPointType");

class DPTStep extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT1.id, DataPointType.TYPES.DPT1.subtypes.step,
            DataPointType.TYPES.DPT1.encoder, DataPointType.TYPES.DPT1.decoder);
    }
}

module.exports = new DPTStep();