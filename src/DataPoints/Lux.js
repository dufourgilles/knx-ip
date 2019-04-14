"use strict";

/*

    // 9.004 lux (Lux)
    "004" : {
        "name" : "DPT_Value_Lux", "desc" : "lux",
        "unit" : "lux", "range" : [0, 670760]
    },
 */
const DataPoint = require("./DataPoint");
const DPTLux = require("../DataPointTypes/DPTLux");

class Lux extends DataPoint {
    constructor(ga) {
        super(ga, DPTLux);
    }


}

module.exports = Lux;