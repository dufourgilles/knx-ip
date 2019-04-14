"use strict";

const DataPoint = require("./DataPoint");
const DPTStartstop = require("../DataPointTypes/DPTStartstop");

class Startstop extends DataPoint {
    constructor(ga) {
        super(ga, DPTStartstop);
    }
}

module.exports = Startstop;