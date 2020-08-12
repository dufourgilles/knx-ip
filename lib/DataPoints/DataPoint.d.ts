import { DataPointType } from '../DataPointTypes/DataPointType';
import { KNXAddress } from '../protocol/KNXAddress';
import { DPT10Value } from '../DataPointTypes/DPT10';
import { DPT3Value } from '../DataPointTypes/DPT3';
import { DPT18Value } from '../DataPointTypes/DPT18';
import { DPTActions } from '../DataPointTypes/definitions';
import { KNXTunnelSocket } from '../KNXTunnelSocket';
export declare type IDataPoint = new (_ga: KNXAddress, typeName?: string) => DataPoint;
export declare class DataPoint {
    private _ga;
    private _type;
    protected _knxTunnelSocket: KNXTunnelSocket;
    protected _value: any;
    protected _actions: DPTActions;
    constructor(_ga: KNXAddress, _type: DataPointType);
    static get UNKOWN_VALUE(): string;
    get id(): string;
    get value(): any;
    get type(): DataPointType;
    bind(knxTunnelSocket: KNXTunnelSocket): void;
    read(): Promise<any>;
    write(val?: string | number | DPT10Value | DPT3Value | Date | DPT18Value | null): Promise<void>;
}
