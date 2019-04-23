"use strict";

/**
 * @typedef {Object} SUBDPT1
 * @property {Object} ids
 * @property {string} switch
 * @property {string} boolean
 * @property {string} enable
 * @property {string} ramp
 * @property {string} alarm
 * @property {string} binary
 * @property {string} step
 * @property {string} updown
 * @property {string} openclose
 * @property {string} startstop
 * @property {string} state
 * @property {string} invert
 * @property {string} dimsend
 * @property {string} input
 * @property {string} reset
 * @property {string} acknowledge
 * @property {string} trigger
 * @property {string} occupied
 * @property {string} opendoor
 * @property {string} andor
 * @property {string} scene
 * @property {string} shutter
 */


const DPT1 = {
    id: "1",
    subtypes: {
        ids: {
            "001": "switch",
            "002": "boolean",
            "003": "enable",
            "004": "ramp",
            "005": "alarm",
            "006": "binary",
            "007": "step",
            "008": "updown",
            "009": "openclose",
            "010": "startstop",
            "011": "state",
            "012": "invert",
            "013": "dimsend",
            "014": "input",
            "015": "reset",
            "016": "acknowledge",
            "017": "trigger",
            "018": "occupied",
            "019": "opendoor",
            "021": "andor",
            "022": "scene",
            "023": "shutter"
        },
        "switch": "001",
        "boolean": "002",
        "enable": "003",
        "ramp": "004",
        "alarm": "005",
        "binary": "006",
        "step": "007",
        "updown": "008",
        "openclose": "009",
        "startstop": "010",
        "state": "011",
        "invert": "012",
        "dimsend": "013",
        "input": "014",
        "reset": "015",
        "acknowledge": "016",
        "trigger": "017",
        "occupied": "018",
        "opendoor": "019",
        "andor": "021",
        "scene": "022",
        "shutter": "023"
    },
    decoder: buffer => {
        if (buffer.length !== 1) {
            throw new Error(`Invalid buffer length ${buffer.length}/${buffer} for DPT1.  Expected 1.`);
        }
        const val = buffer.readUInt8(0);
        if (val !== 0 && val !== 1) {
            throw new Error(`Invalid binary value ${val} for DPT1.  Expected 1 or 0`);
        }
        return val;
    },
    encoder: value => {
        if (value !== 0 && value !== 1) {
            throw new Error(`Invalid value ${value} for a DPT1.  Should be 0 or 1.`);
        }
        const buf = Buffer.alloc(1);
        buf.writeUInt8(value, 0);
        return buf;
    }
};

module.exports = DPT1;