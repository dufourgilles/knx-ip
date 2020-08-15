
/*

    // 9.004 lux (Lux)
    "004" : {
        "name" : "DPT_Value_Lux", "desc" : "lux",
        "unit" : "lux", "range" : [0, 670760]
    },
 */
import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

export = class Lux extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTLux);
    }
};
