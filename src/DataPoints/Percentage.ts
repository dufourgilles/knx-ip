'use strict';

/*
    // 5.001 percentage (0=0..ff=100%)
    "001" : {
        "name" : "DPT_Scaling", "desc" : "percent",
        "unit" : "%", "scalar_range" : [0, 100]
    },
 */
import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

const MIN = 0;
const MAX = 100;

export class Percentage extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTPercentage);

        this._actions = {
            'set': {
                func: this.set.bind(this),
                parameterType: {
                    type: 'integer',
                    min: MIN,
                    max: MAX,
                    default: MIN
                }
            }
        };
    }

    set(param: {value: number}): Promise<void> {
        if ((param == null) || (param.value == null)) {
            throw new Error('Invalid parameter received for set. Expecting {value: number} ');
        }
        const value = Number(param.value);
        if ((value < MIN) || (value > MAX)) {
            throw new Error(`Invalid value ${value}`);
        }
        return this.write(value);
    }
}
