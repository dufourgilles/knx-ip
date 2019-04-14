"use strict";


const DataPoint = require("./DataPoint");
const DPTScenecontrol = require("../DataPointTypes/DPTScenecontrol");

class Scenecontrol extends DataPoint {
    constructor(ga) {
        super(ga, DPTScenecontrol);
    }
}

module.exports = Scenecontrol;