"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataPointType = exports.createDataPoint = void 0;
const Alarm_1 = require("./Alarm");
const Angle_1 = require("./Angle");
const Binary_1 = require("./Binary");
const Date_1 = require("./Date");
const Dimmingcontrol_1 = require("./Dimmingcontrol");
const Enable_1 = require("./Enable");
const Lux_1 = require("./Lux");
const Percentage_1 = require("./Percentage");
const Percentagescaling_1 = require("./Percentagescaling");
const Scene_1 = require("./Scene");
const Scenecontrol_1 = require("./Scenecontrol");
const Speed_1 = require("./Speed");
const Startstop_1 = require("./Startstop");
const Step_1 = require("./Step");
const Switch_1 = require("./Switch");
const Temperature_1 = require("./Temperature");
const Time_1 = require("./Time");
const Trigger_1 = require("./Trigger");
const Updown_1 = require("./Updown");
const DataPointType_1 = require("../DataPointTypes/DataPointType");
const DataPointFactory = {
    Alarm: Alarm_1.Alarm,
    Angle: Angle_1.Angle,
    Binary: Binary_1.Binary,
    Date: Date_1.Date,
    Dimmingcontrol: Dimmingcontrol_1.Dimmingcontrol,
    Enable: Enable_1.Enable,
    Lux: Lux_1.Lux,
    Percentage: Percentage_1.Percentage,
    Percentagescaling: Percentagescaling_1.Percentagescaling,
    Scene: Scene_1.Scene,
    Scenecontrol: Scenecontrol_1.Scenecontrol,
    Speed: Speed_1.Speed,
    Startstop: Startstop_1.Startstop,
    Step: Step_1.Step,
    Switch: Switch_1.Switch,
    Temperature: Temperature_1.Temperature,
    Time: Time_1.Time,
    Trigger: Trigger_1.Trigger,
    Updown: Updown_1.Updown
};
exports.createDataPoint = (ga, typeName) => {
    const DataPointClassName = `${typeName[0].toUpperCase()}${typeName.slice(1).toLowerCase()}`;
    const DataPointClass = DataPointFactory[DataPointClassName];
    if (DataPointClass == null) {
        throw new Error(`Unknown DataPoint type ${typeName}`);
    }
    return new DataPointClass(ga);
};
exports.getDataPointType = (type, subtype) => {
    const dpt = DataPointType_1.DataPointType.TYPES[`DPT${type}`];
    if (dpt == null) {
        throw new Error(`Unknown type ${type}`);
    }
    let _3digitSubtype = `${subtype}`;
    while (_3digitSubtype.length < 3) {
        _3digitSubtype = `0${_3digitSubtype}`;
    }
    const dptSubtype = dpt.subtypes.ids[_3digitSubtype];
    if (dptSubtype == null) {
        throw new Error(`Invalid subtype ${subtype} for type DPT${type}`);
    }
    return dptSubtype;
};
//# sourceMappingURL=DataPointFactory.js.map