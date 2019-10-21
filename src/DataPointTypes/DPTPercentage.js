"use strict";

const DataPointType = require("./DataPointType");

class DPTPercentage extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT5.id, DataPointType.TYPES.DPT5.subtypes.percentage,
            DataPointType.TYPES.DPT5.encoder, buffer => { return DataPointType.TYPES.DPT5.decoder(buffer) / 2.55;});
    }
}

module.exports = new DPTPercentage();