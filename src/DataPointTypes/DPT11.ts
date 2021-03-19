import { BufferLengthError } from '../errors/BufferLengthError';
import { DateFormatError } from '../errors/DateFormatError';
import { InvalidValueError } from '../errors/InvalidValueError';
import {DPT} from './definitions';

export interface DPT11Value {year: number; month: number; day: number; }
export const DPT11: DPT = {
    id: '11',
    subtypes: {
        ids: {
            '001': 'date'
        },
        'date': '001'
    },
    decoder: (buffer: Buffer): DPT11Value  => {
        if (buffer.length !== 3) {
            throw new BufferLengthError(`Invalid buffer length ${buffer.length} for DPT11.  Expected 3.`);
        }
        const day = buffer.readUInt8(0) & 0x1F;
        const month = buffer.readUInt8(1) & 0x0F;
        const year = 2000 + (buffer.readUInt8(2) & 0x7F);
        if (day < 1 || day > 31) {
            throw new DateFormatError(`Invalid day ${day}`);
        }
        if (month < 1 || month > 12) {
            throw new DateFormatError(`Invalid month ${month}`);
        }
        if (year > 2089) {
            throw new DateFormatError(`Invalid year ${year}`);
        }
        return {year, month, day};
    },
    encoder: (value: DPT11Value): Buffer => {
        let year, month, day;

        if (value instanceof Date) {
          year = value.getFullYear();
          month = value.getMonth() + 1;
          day = value.getDay();
        } else {
          year = value.year;
          month = value.month;
          day = value.day;
        }

        if (! (year && month && day)) {
            throw new DateFormatError(`Unexpected Date format - ${value}`);
        }

        const buf = Buffer.alloc(3);
        buf.writeUInt8(day, 0);
        buf.writeUInt8(month, 1);
        buf.writeUInt8(year - (year > 2000 ? 2000 : 1900), 2);

        return buf;
    }
};
