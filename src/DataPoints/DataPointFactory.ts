import { KNXAddress } from '../protocol/KNXAddress';
import { DataPoint, IDataPoint } from './DataPoint';

import Alarm from './Alarm';
import Angle from './Angle';
import Binary from './Binary';
import Date from './Date';
import DimmingControl from './Dimmingcontrol';
import Enable from './Enable';
import Lux from './Lux';
import Percentage from './Percentage';
import PercentageScaling from './Percentagescaling';
import Scene from './Scene';
import Scenecontrol from './Scenecontrol';
import Speed from './Speed';
import Startstop from './Startstop';
import Step from './Step';
import Switch from './Switch';
import Temperature from './Temperature';
import Time from './Time';
import Trigger from './Trigger';
import Updown from './Updown';

type DataPointFactoryItem = ((x: KNXAddress, y: string) => DataPoint) | IDataPoint ;

export const DataPointFactory: {[index: string]: DataPointFactoryItem} = {
    Alarm,
    Angle,
    Binary,
    Date,
    DimmingControl,
    Enable,
    Lux,
    Percentage,
    PercentageScaling,
    Scene,
    Scenecontrol,
    Speed,
    Startstop,
    Step,
    Switch,
    Temperature,
    Time,
    Trigger,
    Updown,
    createDataPoint: (ga: KNXAddress, typeName: string): DataPoint => {
        /** @type {string} */
        const DataPointClassName = `${typeName[0].toUpperCase()}${typeName.slice(1).toLowerCase()}`;
        const DataPointClass: IDataPoint = DataPointFactory[DataPointClassName] as IDataPoint;
        if (DataPointClass == null) {
            throw new Error(`Unknown DataPoint type ${typeName}`);
        }
        return new DataPointClass(ga);
    }
};
