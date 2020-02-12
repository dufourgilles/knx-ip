'use strict';

import {DataPointType} from './DataPointType';

export = class DPTAngle extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT14.id, DataPointType.TYPES.DPT14.subtypes.angle,
            DataPointType.TYPES.DPT14.encoder, DataPointType.TYPES.DPT14.decoder);
    }
};
