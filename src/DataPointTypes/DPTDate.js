"use strict";

const DataPointType = require("./DataPointType");

class DPTDate extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT11.id, DataPointType.TYPES.DPT11.subtypes.date,
            DataPointType.TYPES.DPT11.encoder, DataPointType.TYPES.DPT11.decoder);
    }
}

module.exports = new DPTDate();