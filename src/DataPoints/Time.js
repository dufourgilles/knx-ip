"use strict";

/*

     // 10.001 time of day
  "001" : {
      "name" : "DPT_TimeOfDay", "desc" : "time of day"
  }
 */
const DataPoint = require("./DataPoint");
const DPTTime = require("../DataPointTypes/DPTTime");

class Time extends DataPoint {
    constructor(ga) {
        super(ga, DPTTime);
    }
}

module.exports = Time;