"use strict";

const DataPointType = require("./DataPointType");

class DPTSpeed extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT9.id, DataPointType.TYPES.DPT9.subtypes.speed,
            DataPointType.TYPES.DPT9.encoder, DataPointType.TYPES.DPT9.decoder);
    }
}

module.exports = new DPTSpeed();