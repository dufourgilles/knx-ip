'use strict';

import {DataPointType} from './DataPointType';

export class DPTPercentage extends DataPointType {
    constructor() {
        super(DataPointType.TYPES.DPT5.id, DataPointType.TYPES.DPT5.subtypes.percentage,
            DataPointType.TYPES.DPT5.encoder, (buffer: Buffer): number => DataPointType.TYPES.DPT5.decoder(buffer) / 2.55);
    }
}
