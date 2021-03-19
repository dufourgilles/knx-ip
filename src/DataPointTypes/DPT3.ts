'use strict';
import { BufferLengthError } from '../errors/BufferLengthError';
import { InvalidValueError } from '../errors/InvalidValueError';
import {DPT} from './definitions';

export interface DPT3Value {
    isIncrease: number;
    isUP: number;
    stepCode: number;
}
/**
 * @typedef {Object} SUBDPT3
 * @property {Object} ids
 * @property {string} dimmingcontrol
 * @property {string} blindcontrol
 **/
export const DPT3: DPT = {
    id: '3',
    subtypes: {
        ids: {
            '007': 'dimmingcontrol',
            '008': 'blindcontrol'
        },
        'dimmingcontrol': '007',
        'blindcontrol': '008'
    },
    decoder: (buffer: Buffer): DPT3Value => {
        if (buffer.length !== 1) {
            throw new BufferLengthError(`Invalid buffer length ${buffer.length} for DPT3.  Expected 1.`);
        }
        const val = buffer.readUInt8(0);
        return {
            isIncrease: (val & 0x08) >> 3,
            isUP: (val & 0x08) >> 3,
            stepCode: val & 0x07
        };
    },
    encoder: (value: DPT3Value) => {
        if (value == null || value.stepCode == null ||  (value.isUP == null && value.isIncrease == null)) {
            throw new InvalidValueError(`Invalid value ${value} for DPT3.  Should be object with keys: stepCode and isUP or isIncrease`);
        }
        const buf = Buffer.alloc(1);
        buf.writeUInt8((value.stepCode & 0x07) | (value.isUP == null ? value.isIncrease << 3 : value.isUP << 3), 0);
        return buf;
    }
};
