import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

export class Updown extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTUpdown);
   }
}
