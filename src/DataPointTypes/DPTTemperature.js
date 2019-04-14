"use strict";

const DataPointType = require("./DataPointType");

class DPTTemperature extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT9.id, DataPointType.TYPES.DPT9.subtypes.temperature,
            DataPointType.TYPES.DPT9.encoder, DataPointType.TYPES.DPT9.decoder);
    }
}

module.exports = new DPTTemperature();