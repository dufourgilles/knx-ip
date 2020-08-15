import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';
/*
    // 9.001 temperature (oC)
    "001" : {
        "name" : "DPT_Value_Temp", "desc" : "temperature",
        "unit" : "°C",
        "range" : [-273, 670760]
    },
 */

export = class Temperature extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTTemperature);
    }
};
