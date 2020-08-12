import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

export class Speed extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTSpeed);
    }
}
