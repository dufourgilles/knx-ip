"use strict";

/*
    //  1.007 step
    "007" : { "use" : "FB",
        "name" : "DPT_Step",
        "desc" : "step",
        "enc" : { 0 : "Decrease", 1 : "Increase" }
    },

 */
const DataPoint = require("./DataPoint");
const DPTStep = require("../DataPointTypes/DPTStep");

class Step extends DataPoint {
    constructor(ga) {
        super(ga, DPTStep);
    }
}

module.exports = Step;