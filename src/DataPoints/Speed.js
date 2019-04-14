"use strict";

const DataPoint = require("./DataPoint");
const DPTSpeed = require("../DataPointTypes/DPTSpeed");

class Speed extends DataPoint {
    constructor(ga) {
        super(ga, DPTSpeed);
    }
}

module.exports = Speed;