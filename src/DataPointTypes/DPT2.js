"use strict";
/**
 * @typedef {Object} SUBDPT2
 * @property {Object} ids
 * @property {string} switchcontrol
 * @property {string} booleancontrol
 * @property {string} enablecontrol
 * @property {string} rampcontrol
 * @property {string} alarmcontrol
 * @property {string} binarycontrol
 * @property {string} stepcontrol
 * @property {string} direction1control
 * @property {string} direction2control
 * @property {string} startcontrol
 * @property {string} statecontrol
 * @property {string} invertcontrol
 */
const DPT2 = {
    id: "2",
    subtypes: {
        ids: {
            "001": "switchcontrol",
            "002": "booleancontrol",
            "003": "enablecontrol",
            "004": "rampcontrol",
            "005": "alarmcontrol",
            "006": "binarycontrol",
            "007": "stepcontrol",
            "008": "direction1control",
            "009": "direction2control",
            "010": "startcontrol",
            "011": "statecontrol",
            "012": "invertcontrol"
        },
        "switchcontrol": "001",
        "booleancontrol": "002",
        "enablecontrol": "003",
        "rampcontrol": "004",
        "alarmcontrol": "005",
        "binarycontrol": "006",
        "stepcontrol": "007",
        "direction1control": "008",
        "direction2control": "009",
        "startcontrol": "010",
        "statecontrol": "011",
        "invertcontrol": "012"
    }
};

module.exports = DPT2;