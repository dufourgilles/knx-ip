import { BufferLengthError } from '../errors/BufferLengthError';
import { InvalidValueError } from '../errors/InvalidValueError';
import {DPT} from './definitions';

export interface DPT18Value {
    isLearning: number;
    sceneNumber: number;
}

export const DPT18: DPT = {
    id: '18',
    subtypes: {
        ids: {
            '001': 'scenecontrol'
        },
        'scenecontrol': '001'
    },
    decoder: (buffer: Buffer): DPT18Value => {
        if (buffer.length !== 1) {
            throw new BufferLengthError(`Invalid buffer length ${buffer.length} for DPT18.  Expected 1.`);
        }
        const val = buffer.readUInt8(0);
        return {
            isLearning: (val & 0x80) >> 7,
            sceneNumber: val & 0x3F
        };
    },
    encoder: (value: DPT18Value): Buffer => {
        if (value == null || value.isLearning == null || value.sceneNumber == null) {
            throw new InvalidValueError(`Invalid value ${value} for DPT18.  Expected object with keys isLearning and sceneNumber`);
        }
        const buf = Buffer.alloc(1);
        buf.writeUInt8(value.sceneNumber | (value.isLearning << 7), 0);
        return buf;
    }
};
