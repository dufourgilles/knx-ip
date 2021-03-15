import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';
/*
    //  1.001 on/off
    "001": { "use" : "G",
        "name" : "DPT_Switch",
        "desc" : "switch",
        "enc" : { 0 : "Off", 1 : "On" }
    },

 */

export class Switch extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTSwitch);
        this._actions = {
            'off': {func: this.setOff.bind(this), parameterType: null},
            'on': {func: this.setOn.bind(this), parameterType: null}
        };
    }

    /**
     *
     */
    setOff(): Promise<void> {
        return this.write(0);
    }

    /**
     *
     */
    setOn(): Promise<void> {
        return this.write(1);
    }
}
