"use strict";

/*

  // 11.001 date
  "001" : {
      name : "DPT_Date", desc : "Date"
  }
 */
const DataPoint = require("./DataPoint");
const DPTDate = require("../DataPointTypes/DPTDate");

class Date extends DataPoint {
    constructor(ga) {
        super(ga, DPTDate);
    }
}

module.exports = Date;