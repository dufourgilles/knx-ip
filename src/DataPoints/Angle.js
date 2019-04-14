"use strict";

/*
  "007" : {
    "name" : "DPT_Value_AngleDeg°",
    "desc" : "angle, degree",
    "unit" : "°"
  },
 */
const DataPoint = require("./DataPoint");
const DPTAngle = require("../DataPointTypes/DPTAngle");

class Angle extends DataPoint {
    constructor(ga) {
        super(ga, DPTAngle);
    }
}

module.exports = Angle;