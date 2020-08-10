/// <reference types="node" />
import { KNXAddressType } from '../KNXAddress';
export declare enum FrameType {
    type0 = 0,
    type1 = 1
}
export declare enum OnOff {
    off = 0,
    on = 1
}
export declare enum Priority {
    Prio0 = 0,
    Prio1 = 1,
    Prio2 = 2,
    Prio3 = 3
}
export declare class ControlField {
    private control1;
    private control2;
    set frameType(frameType: FrameType);
    get frameType(): FrameType;
    set repeat(repeat: OnOff);
    get repeat(): OnOff;
    set broadcast(broadcast: OnOff);
    get broadcast(): OnOff;
    set priority(priority: Priority);
    get priority(): Priority;
    set ack(ack: OnOff);
    get ack(): OnOff;
    set error(error: OnOff);
    get error(): OnOff;
    set addressType(type: KNXAddressType);
    get addressType(): KNXAddressType;
    set hopCount(hopCount: number);
    get hopCount(): number;
    set frameFormat(format: number);
    get framrFormat(): number;
    static get DEFAULT_CONTROL1(): number;
    static get DEFAULT_CONTROL2(): number;
    readonly length: number;
    constructor(control1?: number, control2?: number);
    static createFromBuffer(buffer: Buffer, offset?: number): ControlField;
    toBuffer(): Buffer;
}
