"use strict";

const DataPointType = require("./DataPointType");

class DPTScenecontrol extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT18.id, DataPointType.TYPES.DPT18.subtypes.scenecontrol,
            DataPointType.TYPES.DPT18.encoder, DataPointType.TYPES.DPT18.decoder);
    }
}

module.exports = new DPTScenecontrol();