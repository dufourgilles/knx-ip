"use strict";

const DataPointType = require("./DataPointType");

class DPTBinary extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT1.id, DataPointType.TYPES.DPT1.subtypes.binary,
            DataPointType.TYPES.DPT1.encoder,
            DataPointType.TYPES.DPT1.decoder);
    }
}

module.exports = new DPTBinary();