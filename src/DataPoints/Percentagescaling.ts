import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

const MIN = 0;
const MAX = 255;

export class Percentagescaling extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTPercentagescaling);

        this._actions = {
            'set': {
                func: this.set.bind(this),
                parameterType: {
                    type: 'integer',
                    min: MIN,
                    max: MAX
                }
            }
        };
    }

    set(_value: number): Promise<void> {
        const value = Number(_value);
        if ((value < MIN) || (value > MAX)) {
            throw new Error(`Invalid value ${value}`);
        }
        return this.write(value);
    }
}
