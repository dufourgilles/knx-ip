"use strict";

const DataPoint = require("./DataPoint");
const DPTEnable = require("../DataPointTypes/DPTEnable");

class Enable extends DataPoint {
    constructor(ga) {
        super(ga, DPTEnable);
    }
}

module.exports = Enable;