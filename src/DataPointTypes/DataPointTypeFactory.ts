
import {DPTAlarm} from '../DataPointTypes/DPTAlarm';
import {DPTAngle} from '../DataPointTypes/DPTAngle';
import {DPTBinary} from '../DataPointTypes/DPTBinary';
import {DPTDate} from '../DataPointTypes/DPTDate';
import {DPTDimmingcontrol} from '../DataPointTypes/DPTDimmingcontrol';
import {DPTEnable} from '../DataPointTypes/DPTEnable';
import {DPTLux} from '../DataPointTypes/DPTLux';
import {DPTPercentage} from '../DataPointTypes/DPTPercentage';
import {DPTPercentagescaling} from '../DataPointTypes/DPTPercentagescaling';
import {DPTScene} from '../DataPointTypes/DPTScene';
import {DPTScenecontrol} from '../DataPointTypes/DPTScenecontrol';
import {DPTSpeed} from '../DataPointTypes/DPTSpeed';
import {DPTStartstop} from '../DataPointTypes/DPTStartstop';
import {DPTStep} from '../DataPointTypes/DPTStep';
import {DPTSwitch} from '../DataPointTypes/DPTSwitch';
import {DPTTemperature} from '../DataPointTypes/DPTTemperature';
import {DPTTime} from '../DataPointTypes/DPTTime';
import {DPTTrigger} from '../DataPointTypes/DPTTrigger';
import {DPTUpdown} from '../DataPointTypes/DPTUpdown';
import { DataPointType } from './DataPointType';

export const DPTS: {[index: string]: DataPointType} = {
    DPTAlarm: new DPTAlarm(),
    DPTAngle: new DPTAngle(),
    DPTBinary: new DPTBinary(),
    DPTDate: new DPTDate(),
    DPTDimmingcontrol: new DPTDimmingcontrol(),
    DPTEnable: new DPTEnable(),
    DPTLux: new DPTLux(),
    DPTPercentage: new DPTPercentage(),
    DPTPercentagescaling: new DPTPercentagescaling(),
    DPTScene: new DPTScene(),
    DPTScenecontrol: new DPTScenecontrol(),
    DPTSpeed: new DPTSpeed(),
    DPTStartstop: new DPTStartstop(),
    DPTStep: new DPTStep(),
    DPTSwitch: new DPTSwitch(),
    DPTTemperature: new DPTTemperature(),
    DPTTime: new DPTTime(),
    DPTTrigger: new DPTTrigger(),
    DPTUpdown: new DPTUpdown()
};
