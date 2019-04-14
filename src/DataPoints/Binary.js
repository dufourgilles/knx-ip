"use strict";

const DataPoint = require("./DataPoint");
const DPTBinary = require("../DataPointTypes/DPTBinary");

class Binary extends DataPoint {
    constructor(ga) {
        super(ga, DPTBinary);
    }
}

module.exports = Binary;