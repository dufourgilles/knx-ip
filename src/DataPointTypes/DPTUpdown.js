"use strict";

const DataPointType = require("./DataPointType");

class DPTUpdown extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT1.id, DataPointType.TYPES.DPT1.subtypes.updown,
            DataPointType.TYPES.DPT1.encoder,
            DataPointType.TYPES.DPT1.decoder);
    }
}

module.exports = new DPTUpdown();