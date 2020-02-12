'use strict';

import {DataPointType} from './DataPointType';

export = class DPTTrigger extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT1.id, DataPointType.TYPES.DPT1.subtypes.trigger,
            DataPointType.TYPES.DPT1.encoder,
            DataPointType.TYPES.DPT1.decoder);
    }
};
