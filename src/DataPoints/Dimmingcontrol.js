"use strict";

/*
  // 3.007 dimming control
  "007": {
    "name": "DPT_Control_Dimming",
    "desc": "dimming control"
  },
 */
const DataPoint = require("./DataPoint");
const DPTDimmingControl = require("../DataPointTypes/DPTDimmingcontrol");

class Dimmingcontrol extends DataPoint {
    constructor(ga) {
        super(ga, DPTDimmingControl);
    }
}

module.exports = Dimmingcontrol;