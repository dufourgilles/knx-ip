import { DataPoint } from './DataPoint';
import { KNXAddress } from '../protocol/KNXAddress';
export declare class Switch extends DataPoint {
    constructor(ga: KNXAddress);
    setOff(): void;
    setOn(): void;
}
