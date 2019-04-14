"use strict";

const DataPoint = require("./DataPoint");
const DPTTrigger = require("../DataPointTypes/DPTTrigger");

class Trigger extends DataPoint {
    constructor(ga) {
        super(ga, DPTTrigger);
    }
}

module.exports = Trigger;