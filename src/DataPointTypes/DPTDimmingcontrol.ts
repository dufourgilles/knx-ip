import {DataPointType} from './DataPointType';

export class DPTDimmingcontrol extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT3.id, DataPointType.TYPES.DPT3.subtypes.dimmingcontrol,
            DataPointType.TYPES.DPT3.encoder, DataPointType.TYPES.DPT3.decoder);
    }
}
