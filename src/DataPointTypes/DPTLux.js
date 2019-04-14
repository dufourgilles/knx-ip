"use strict";

const DataPointType = require("./DataPointType");

class DPTLux extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT9.id, DataPointType.TYPES.DPT9.subtypes.lux,
            DataPointType.TYPES.DPT9.encoder, DataPointType.TYPES.DPT9.decoder);
    }
}

module.exports = new DPTLux();