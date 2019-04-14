"use strict";

/*
    // 9.001 temperature (oC)
    "001" : {
        "name" : "DPT_Value_Temp", "desc" : "temperature",
        "unit" : "°C",
        "range" : [-273, 670760]
    },
 */
const DataPoint = require("./DataPoint");
const DPTTemperature = require("../DataPointTypes/DPTTemperature");

class Temperature extends DataPoint {
    constructor(ga) {
        super(ga, DPTTemperature);
    }
}

module.exports = Temperature;