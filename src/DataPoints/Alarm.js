"use strict";

/*
    //  1.005 alarm
    "005" : { "use" : "FB",
        "name" : "DPT_Alarm",
        "desc" : "alarm",
        "enc" : { 0 : "No alarm", 1 : "Alarm" }
    },
 */
const DataPoint = require("./DataPoint");
const DPTAlarm = require("../DataPointTypes/DPTAlarm");

class Alarm extends DataPoint {
    constructor(ga) {
        super(ga, DPTAlarm);
    }
}

module.exports = Alarm;