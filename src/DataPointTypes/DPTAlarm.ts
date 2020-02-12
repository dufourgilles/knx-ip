'use strict';

import {DataPointType} from './DataPointType';

export = class DPTAlarm extends DataPointType {
    constructor() {
        super(
            DataPointType.TYPES.DPT1.id,
            DataPointType.TYPES.DPT1.subtypes.alarm,
            DataPointType.TYPES.DPT1.encoder,
            DataPointType.TYPES.DPT1.decoder
        );
    }
};
