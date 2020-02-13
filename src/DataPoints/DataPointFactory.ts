import { KNXAddress } from '../protocol/KNXAddress';
import { DataPoint, IDataPoint } from './DataPoint';

import Alarm from './Alarm';
import Angle from './Angle';
import Binary from './Binary';
import Date from './Date';
import Dimmingcontrol from './Dimmingcontrol';
import Enable from './Enable';
import Lux from './Lux';
import Percentage from './Percentage';
import Percentagescaling from './Percentagescaling';
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
import { DataPointType } from '../DataPointTypes/DataPointType';
import { DPT } from '../DataPointTypes/definitions';

type DataPointFactoryItem = (
    ((x: KNXAddress, y: string) => DataPoint) |
    ((type: string|number, subtype: string|number) => string) |
    IDataPoint
);

export const DataPointFactory: {[index: string]: DataPointFactoryItem} = {
    Alarm,
    Angle,
    Binary,
    Date,
    Dimmingcontrol,
    Enable,
    Lux,
    Percentage,
    Percentagescaling,
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
    },
    getDataPointType: (type: string|number, subtype: string|number): string => {
        const dpt: DPT = DataPointType.TYPES[`DPT${type}`];
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
    }
};
