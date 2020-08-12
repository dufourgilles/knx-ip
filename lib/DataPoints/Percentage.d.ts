import { DataPoint } from './DataPoint';
import { KNXAddress } from '../protocol/KNXAddress';
export declare class Percentage extends DataPoint {
    constructor(ga: KNXAddress);
    set(param: {
        value: number;
    }): void;
}
