"use strict";

const DPT18 = {
    id: "18",
    subtypes: {
        ids: {
            "001": "scenecontrol",
        },
        "scenecontrol": "001",
    },
    decoder: buffer => {
        if (buffer.length !== 1) {
            throw new Error(`Invalid buffer length ${buffer.length} for DPT18.  Expected 1.`);
        }
        const val = buffer.readUInt8(0);
        return {
            isLearning: (val & 0x80) >> 7,
            sceneNumber: val & 0x3F
        };
    },
    encoder: value => {
        if (value == null || value.isLearning == null || value.sceneNumber == null) {
            throw new Error(`Invalid value ${value} for DPT18.  Expected object with keys isLearning and sceneNumber`);
        }
        const buf = Buffer.alloc(1);
        buf.writeUInt8(value.sceneNumber | (value.isLearning << 7), 0);
        return buf;
    }
};

module.exports = DPT18;