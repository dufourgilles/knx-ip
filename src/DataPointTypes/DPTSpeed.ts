'use strict';

import {DataPointType} from './DataPointType';

export class DPTSpeed extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT9.id, DataPointType.TYPES.DPT9.subtypes.speed,
            DataPointType.TYPES.DPT9.encoder, DataPointType.TYPES.DPT9.decoder);
    }
}
