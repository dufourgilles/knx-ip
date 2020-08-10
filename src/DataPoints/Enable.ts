import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

export class Enable extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTEnable);
    }
}
