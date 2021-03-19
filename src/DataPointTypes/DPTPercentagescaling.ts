'use strict';

import {DataPointType} from './DataPointType';

export class DPTPercentagescaling extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT5.id, DataPointType.TYPES.DPT5.subtypes.percentagescaling,
            DataPointType.TYPES.DPT5.encoder, DataPointType.TYPES.DPT5.decoder);
    }
}
