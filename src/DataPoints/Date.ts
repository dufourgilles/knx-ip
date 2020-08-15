/*

  // 11.001 date
  "001" : {
      name : "DPT_Date", desc : "Date"
  }
 */
import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

export = class Date extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTDate);
    }
};
