'use strict';

/*
    //  1.005 alarm
    "005" : { "use" : "FB",
        "name" : "DPT_Alarm",
        "desc" : "alarm",
        "enc" : { 0 : "No alarm", 1 : "Alarm" }
    },
 */
import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

export = class Alarm extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTAlarm);
    }
};
