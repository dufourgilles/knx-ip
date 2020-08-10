import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';
/*

     // 10.001 time of day
  "001" : {
      "name" : "DPT_TimeOfDay", "desc" : "time of day"
  }
 */

export class Time extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTTime);
    }
}
