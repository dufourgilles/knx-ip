"use strict";

const DataPointType = require("./DataPointType");

class DPTAngle extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT14.id, DataPointType.TYPES.DPT14.subtypes.angle,
            DataPointType.TYPES.DPT14.encoder, DataPointType.TYPES.DPT14.decoder);
    }
}

module.exports = new DPTAngle();