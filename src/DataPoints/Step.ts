import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';
/*
    //  1.007 step
    "007" : { "use" : "FB",
        "name" : "DPT_Step",
        "desc" : "step",
        "enc" : { 0 : "Decrease", 1 : "Increase" }
    },

 */

export = class Step extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTStep);
    }
};
