/// <reference types="node" />
import { KNXDataBuffer } from '../KNXDataBuffer';
export declare class NPDU {
    private _tpci;
    private _apci;
    private _data;
    set tpci(tpci: number);
    get tpci(): number;
    set apci(apci: number);
    get apci(): number;
    get dataBuffer(): KNXDataBuffer;
    get dataValue(): Buffer;
    set data(data: KNXDataBuffer);
    get length(): number;
    get action(): number;
    set action(action: number);
    get isGroupRead(): boolean;
    get isGroupWrite(): boolean;
    get isGroupResponse(): boolean;
    static get GROUP_READ(): number;
    static get GROUP_RESPONSE(): number;
    static get GROUP_WRITE(): number;
    static get INDIVIDUAL_WRITE(): number;
    static get INDIVIDUAL_READ(): number;
    static get INDIVIDUAL_RESPONSE(): number;
    static get TPCI_UNUMBERED_PACKET(): number;
    constructor(_tpci?: number, _apci?: number, _data?: KNXDataBuffer);
    static createFromBuffer(buffer: Buffer, offset?: number): NPDU;
    toBuffer(): Buffer;
}
