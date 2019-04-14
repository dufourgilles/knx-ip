"use strict";

const DPT10 = {
    id: "10",
    subtypes: {
        ids: {
            "001": "time"
        },
        "time": "001"
    },
    decoder: buffer => {
        if (buffer.length !== 3) {
            throw new Error(`Invalid buffer length ${buffer.length} for DPT10.  Expected 3.`);
        }
        const val = buffer.readUInt8(0);
        const day = (val >> 5) & 0x07;
        const hours = val & 0x1F;
        const minutes = buffer.readUInt8(1) & 0x3F;
        const seconds = buffer.readUInt8(2) & 0x3F;
        return {day, hours, minutes, seconds};
    },
    encoder: value => {
        if (value == null || value.day == null || value.hours == null || values.minutes == null || value.seconds == null) {
            throw new Error(`Invalid value ${value} for DPT10.  Should be object with keys day, hours, minutes and seconds`);
        }
        const buf = Buffer.alloc(3);
        buf.writeUInt8((value.hours & 0x1F) | (value.day << 5), 0);
        return buf;
    }
};

module.exports = DPT10;