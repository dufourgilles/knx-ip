'use strict';

import {DataPointType} from './DataPointType';

export class DPTStep extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT1.id, DataPointType.TYPES.DPT1.subtypes.step,
            DataPointType.TYPES.DPT1.encoder, DataPointType.TYPES.DPT1.decoder);
    }
}
