"use strict";

const DataPointType = require("./DataPointType");

class DPTSwitch extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT1.id, DataPointType.TYPES.DPT1.subtypes.switch,
            DataPointType.TYPES.DPT1.encoder,
            DataPointType.TYPES.DPT1.decoder);
    }
}

module.exports = new DPTSwitch();