"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataPointType = exports.createDataPoint = void 0;
const Alarm_1 = __importDefault(require("./Alarm"));
const Angle_1 = __importDefault(require("./Angle"));
const Binary_1 = __importDefault(require("./Binary"));
const Date_1 = __importDefault(require("./Date"));
const Dimmingcontrol_1 = __importDefault(require("./Dimmingcontrol"));
const Enable_1 = __importDefault(require("./Enable"));
const Lux_1 = __importDefault(require("./Lux"));
const Percentage_1 = __importDefault(require("./Percentage"));
const Percentagescaling_1 = __importDefault(require("./Percentagescaling"));
const Scene_1 = __importDefault(require("./Scene"));
const Scenecontrol_1 = __importDefault(require("./Scenecontrol"));
const Speed_1 = __importDefault(require("./Speed"));
const Startstop_1 = __importDefault(require("./Startstop"));
const Step_1 = __importDefault(require("./Step"));
const Switch_1 = __importDefault(require("./Switch"));
const Temperature_1 = __importDefault(require("./Temperature"));
const Time_1 = __importDefault(require("./Time"));
const Trigger_1 = __importDefault(require("./Trigger"));
const Updown_1 = __importDefault(require("./Updown"));
const DataPointType_1 = require("../DataPointTypes/DataPointType");
const DataPointFactory = {
    Alarm: Alarm_1.default,
    Angle: Angle_1.default,
    Binary: Binary_1.default,
    Date: Date_1.default,
    Dimmingcontrol: Dimmingcontrol_1.default,
    Enable: Enable_1.default,
    Lux: Lux_1.default,
    Percentage: Percentage_1.default,
    Percentagescaling: Percentagescaling_1.default,
    Scene: Scene_1.default,
    Scenecontrol: Scenecontrol_1.default,
    Speed: Speed_1.default,
    Startstop: Startstop_1.default,
    Step: Step_1.default,
    Switch: Switch_1.default,
    Temperature: Temperature_1.default,
    Time: Time_1.default,
    Trigger: Trigger_1.default,
    Updown: Updown_1.default
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