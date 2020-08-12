/// <reference types="node" />
import { IDataPoint } from '../DataPoints/DataPointInterface';
export declare class KNXDataBuffer {
    private _data;
    private _info?;
    constructor(_data: Buffer, _info?: IDataPoint);
    get length(): number;
    get value(): Buffer;
    get info(): IDataPoint | null;
    sixBits(): boolean;
}
