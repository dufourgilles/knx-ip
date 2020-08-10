"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DPT11 = void 0;
exports.DPT11 = {
    id: '11',
    subtypes: {
        ids: {
            '001': 'date'
        },
        'date': '001'
    },
    decoder: (buffer) => {
        if (buffer.length !== 3) {
            throw new Error(`Invalid buffer length ${buffer.length} for DPT11.  Expected 3.`);
        }
        const day = buffer.readUInt8(0) & 0x1F;
        const month = buffer.readUInt8(1) & 0x0F;
        const year = 2000 + (buffer.readUInt8(2) & 0x7F);
        if (day < 1 || day > 31) {
            throw new Error(`Invalid day ${day}`);
        }
        if (month < 1 || month > 12) {
            throw new Error(`Invalid month ${month}`);
        }
        if (year > 2089) {
            throw new Error(`Invalid year ${year}`);
        }
        return { year, month, day };
    },
    encoder: (value) => {
        if (!(value instanceof Date)) {
            throw new Error(`Unexpected Date format - ${value}`);
        }
        const buf = Buffer.alloc(3);
        buf.writeUInt8(value.getDay(), 0);
        buf.writeUInt8(value.getMonth() + 1, 1);
        const year = value.getFullYear();
        buf.writeUInt8(year - (year > 2000 ? 2000 : 1900), 2);
        return buf;
    }
};
//# sourceMappingURL=DPT11.js.map