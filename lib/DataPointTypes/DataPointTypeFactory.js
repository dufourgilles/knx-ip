"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DPTS = void 0;
const DPTAlarm_1 = __importDefault(require("../DataPointTypes/DPTAlarm"));
const DPTAngle_1 = __importDefault(require("../DataPointTypes/DPTAngle"));
const DPTBinary_1 = __importDefault(require("../DataPointTypes/DPTBinary"));
const DPTDate_1 = __importDefault(require("../DataPointTypes/DPTDate"));
const DPTDimmingcontrol_1 = __importDefault(require("../DataPointTypes/DPTDimmingcontrol"));
const DPTEnable_1 = __importDefault(require("../DataPointTypes/DPTEnable"));
const DPTLux_1 = __importDefault(require("../DataPointTypes/DPTLux"));
const DPTPercentage_1 = __importDefault(require("../DataPointTypes/DPTPercentage"));
const DPTPercentagescaling_1 = __importDefault(require("../DataPointTypes/DPTPercentagescaling"));
const DPTScene_1 = __importDefault(require("../DataPointTypes/DPTScene"));
const DPTScenecontrol_1 = __importDefault(require("../DataPointTypes/DPTScenecontrol"));
const DPTSpeed_1 = __importDefault(require("../DataPointTypes/DPTSpeed"));
const DPTStartstop_1 = __importDefault(require("../DataPointTypes/DPTStartstop"));
const DPTStep_1 = __importDefault(require("../DataPointTypes/DPTStep"));
const DPTSwitch_1 = __importDefault(require("../DataPointTypes/DPTSwitch"));
const DPTTemperature_1 = __importDefault(require("../DataPointTypes/DPTTemperature"));
const DPTTime_1 = __importDefault(require("../DataPointTypes/DPTTime"));
const DPTTrigger_1 = __importDefault(require("../DataPointTypes/DPTTrigger"));
const DPTUpdown_1 = __importDefault(require("../DataPointTypes/DPTUpdown"));
exports.DPTS = {
    DPTAlarm: new DPTAlarm_1.default(),
    DPTAngle: new DPTAngle_1.default(),
    DPTBinary: new DPTBinary_1.default(),
    DPTDate: new DPTDate_1.default(),
    DPTDimmingcontrol: new DPTDimmingcontrol_1.default(),
    DPTEnable: new DPTEnable_1.default(),
    DPTLux: new DPTLux_1.default(),
    DPTPercentage: new DPTPercentage_1.default(),
    DPTPercentagescaling: new DPTPercentagescaling_1.default(),
    DPTScene: new DPTScene_1.default(),
    DPTScenecontrol: new DPTScenecontrol_1.default(),
    DPTSpeed: new DPTSpeed_1.default(),
    DPTStartstop: new DPTStartstop_1.default(),
    DPTStep: new DPTStep_1.default(),
    DPTSwitch: new DPTSwitch_1.default(),
    DPTTemperature: new DPTTemperature_1.default(),
    DPTTime: new DPTTime_1.default(),
    DPTTrigger: new DPTTrigger_1.default(),
    DPTUpdown: new DPTUpdown_1.default()
};
//# sourceMappingURL=DataPointTypeFactory.js.map