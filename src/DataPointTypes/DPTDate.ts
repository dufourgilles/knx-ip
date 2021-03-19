'use strict';

import {DataPointType} from './DataPointType';

export class DPTDate extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT11.id, DataPointType.TYPES.DPT11.subtypes.date,
            DataPointType.TYPES.DPT11.encoder, DataPointType.TYPES.DPT11.decoder);
    }
}
