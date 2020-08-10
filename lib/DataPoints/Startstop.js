"use strict";
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
module.exports = class Startstop extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTStartstop);
    }
};
//# sourceMappingURL=Startstop.js.map