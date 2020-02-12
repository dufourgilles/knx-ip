import {DataPoint} from './DataPoint';
import {DPTS} from '../DataPointTypes/DataPointTypeFactory';
import { KNXAddress } from '../protocol/KNXAddress';

export = class Scenecontrol extends DataPoint {
    constructor(ga: KNXAddress) {
        super(ga, DPTS.DPTScenecontrol);
    }
};
