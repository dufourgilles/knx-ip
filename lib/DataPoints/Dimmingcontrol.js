'use strict';
const DataPoint_1 = require("./DataPoint");
const DataPointTypeFactory_1 = require("../DataPointTypes/DataPointTypeFactory");
module.exports = class Dimmingcontrol extends DataPoint_1.DataPoint {
    constructor(ga) {
        super(ga, DataPointTypeFactory_1.DPTS.DPTDimmingcontrol);
    }
};
//# sourceMappingURL=Dimmingcontrol.js.map