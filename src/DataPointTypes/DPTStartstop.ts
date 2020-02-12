'use strict';

import {DataPointType} from './DataPointType';

export = class DPTStartstop extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT1.id, DataPointType.TYPES.DPT1.subtypes.startstop,
            DataPointType.TYPES.DPT1.encoder, DataPointType.TYPES.DPT1.decoder);
    }
};
