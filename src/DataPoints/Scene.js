"use strict";

const DataPoint = require("./DataPoint");
const DPTScene = require("../DataPointTypes/DPTScene");

class Scene extends DataPoint {
    constructor(ga) {
        super(ga, DPTScene);
    }
}

module.exports = Scene;