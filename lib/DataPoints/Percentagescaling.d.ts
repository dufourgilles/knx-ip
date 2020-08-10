import { KNXAddress } from '../protocol/KNXAddress';
declare const _default: {
    new (ga: KNXAddress): {
        set(_value: number): void;
        _knxTunnelSocket: import("..").KNXTunnelSocket;
        _value: any;
        _actions: import("../DataPointTypes/definitions").DPTActions;
        _ga: KNXAddress;
        _type: import("../DataPointTypes/DataPointType").DataPointType;
        readonly id: string;
        readonly value: any;
        readonly type: import("../DataPointTypes/DataPointType").DataPointType;
        bind(knxTunnelSocket: import("..").KNXTunnelSocket): void;
        read(): Promise<any>;
        write(val?: string | number | Date | import("../DataPointTypes/DPT3").DPT3Value | import("../DataPointTypes/DPT10").DPT10Value | import("../DataPointTypes/DPT18").DPT18Value): Promise<void>;
    };
    readonly UNKOWN_VALUE: string;
};
export = _default;
