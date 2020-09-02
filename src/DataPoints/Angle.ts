'use strict';

/*
  "007" : {
    "name" : "DPT_Value_AngleDeg°",
    "desc" : "angle, degree",
    "unit" : "°"
  },
 */
import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

export class Angle extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTAngle);
    }
}
