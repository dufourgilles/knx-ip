"use strict";

const DataPoint = require("./DataPoint");
const DPTUpdown = require("../DataPointTypes/DPTUpdown");

class Updown extends DataPoint {
    constructor(ga) {
        super(ga, DPTUpdown);
    }
}

module.exports = Updown;