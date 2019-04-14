"use strict";

/*
    //  1.001 on/off
    "001": { "use" : "G",
        "name" : "DPT_Switch",
        "desc" : "switch",
        "enc" : { 0 : "Off", 1 : "On" }
    },


 */
const DataPoint = require("./DataPoint");
const DPTSwitch = require("../DataPointTypes/DPTSwitch");

class Switch extends DataPoint {
    constructor(ga) {
        super(ga, DPTSwitch);
        this._actions = {
            "off": {func: this.setOff.bind(this), parameterType: null},
            "on": {func: this.setOn.bind(this), parameterType: null}
        };
    }


    /**
     *
     */
    setOff() {
        this.write(0);
    }

    /**
     *
     */
    setOn() {
        this.write(1);
    }
}

module.exports = Switch;