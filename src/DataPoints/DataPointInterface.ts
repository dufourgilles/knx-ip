import {DataPointType} from '../DataPointTypes/DataPointType';
import { KNXTunnelSocket } from '../KNXTunnelSocket';
import { DPT10Value } from '../DataPointTypes/DPT10';
import { DPT3Value } from '../DataPointTypes/DPT3';
import { DPT18Value } from '../DataPointTypes/DPT18';

export interface IDataPoint {
    id: string;
    value: any;
    type: DataPointType;
    bind: (knxTunnelSocket: KNXTunnelSocket) => void;
    read: () => Promise<any>;
    write: (val: string|number|DPT10Value|DPT3Value|Date|DPT18Value|null) => Promise<void>;
}
