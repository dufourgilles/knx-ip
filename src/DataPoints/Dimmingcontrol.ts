'use strict';

/*
  // 3.007 dimming control
  "007": {
    "name": "DPT_Control_Dimming",
    "desc": "dimming control"
  },
 */

import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

export = class Dimmingcontrol extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTDimmingcontrol);
    }
};
