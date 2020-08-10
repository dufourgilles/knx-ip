/// <reference types="node" />
import { DIB } from './DIB';
export declare enum Medium {
    TP1,
    PL110,
    RF,
    IP
}
export declare class DeviceInfo implements DIB {
    get type(): number;
    set ip(ip: string);
    get ip(): string;
    get status(): number;
    set status(status: number);
    set name(name: string);
    get name(): string;
    set projectID(id: number);
    get projectID(): number;
    set serialNumber(serialNumber: number[]);
    get serialNumber(): number[];
    set macAddress(macAddress: number[]);
    get macAddress(): number[];
    set medium(medium: Medium);
    get medium(): Medium;
    get formattedMedium(): string;
    set address(address: number);
    get address(): number;
    get formattedAddress(): string;
    get length(): number;
    private _status;
    private _splitIP;
    private _name;
    private _projectID;
    private _serialNumber;
    private _macAddress;
    private _medium;
    private _address;
    private _type;
    constructor(medium: Medium, status: number, address: number, projectID: number, serialNumber: number[], ip: string, macAddress: number[], name: string);
    static validArray: (a: Array<number>, length: number) => Array<number>;
    static createFromBuffer(buffer: Buffer, offset?: number): DeviceInfo;
    setMediumFromString(medium: string): void;
    toBuffer(): Buffer;
}
