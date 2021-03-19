import { BufferLengthError } from '../errors/BufferLengthError';
import { InvalidValueError } from '../errors/InvalidValueError';
import {DPT} from './definitions';

export interface DPT10Value {
    day: number;
    hours: number ;
    minutes: number;
    seconds: number;
}

export const DPT10: DPT = {
    id: '10',
    subtypes: {
        ids: {
            '001': 'time'
        },
        'time': '001'
    },
    decoder: (buffer: Buffer): DPT10Value => {
        if (buffer.length !== 3) {
            throw new BufferLengthError(`Invalid buffer length ${buffer.length} for DPT10.  Expected 3.`);
        }
        const val = buffer.readUInt8(0);
        const day = (val >> 5) & 0x07;
        const hours = val & 0x1F;
        const minutes = buffer.readUInt8(1) & 0x3F;
        const seconds = buffer.readUInt8(2) & 0x3F;
        return {day, hours, minutes, seconds};
    },
    encoder: (value: DPT10Value): Buffer => {
        if (value == null || value.day == null || value.hours == null || value.minutes == null || value.seconds == null) {
            throw new InvalidValueError(`Invalid value ${value} for DPT10.  Should be object with keys day, hours, minutes and seconds`);
        }
        const buf = Buffer.alloc(3);
        buf.writeUInt8((value.hours & 0x1F) | (value.day << 5), 0);
        buf.writeUInt8(value.minutes & 0x3F, 1);
        buf.writeUInt8(value.seconds & 0x3F, 2);
        return buf;
    }
};
