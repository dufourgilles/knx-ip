"use strict";

const DPT3 = {
    id: "3",
    subtypes: {
        ids: {
            "007": "dimmingcontrol",
            "008": "blindcontrol"
        },
        "dimmingcontrol": "007",
        "blindcontrol": "008"
    },
    decoder: buffer => {
        if (buffer.length !== 1) {
            throw new Error(`Invalid buffer length ${buffer.length} for DPT3.  Expected 1.`);
        }
        const val = buffer.readUInt8(0);
        return {
            isIncrease: (val & 0x08) >> 3,
            isUP: (val & 0x08) >> 3,
            stepCode: val & 0x07
        };
    },
    encoder: value => {
        if (value == null || value.stepCode == null ||  (value.isUP == null && value.isIncrease == null)) {
            throw new Error(`Invalid value ${value} for DPT3.  Should be object with keys: stepCode and isUP or isIncrease`);
        }
        const buf = Buffer.alloc(1);
        buf.writeUInt8((value.stepCode & 0x07) | (value.isUP == null ? value.isIncrease << 3 : value.isUP << 3), 0);
        return buf;
    }
};

module.exports = DPT3;