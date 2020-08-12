import { KNXAddress } from '../protocol/KNXAddress';
import { DataPoint } from './DataPoint';
export declare const createDataPoint: (ga: KNXAddress, typeName: string) => DataPoint;
export declare const getDataPointType: (type: string | number, subtype: string | number) => string;
