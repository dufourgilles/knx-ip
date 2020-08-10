/// <reference types="node" />
export declare enum KNXAddressType {
    TYPE_INDIVIDUAL = 0,
    TYPE_GROUP = 1
}
export declare enum KNXAddressLevel {
    LEVEL_TWO = 2,
    LEVEL_THREE = 3
}
export declare class KNXAddress {
    readonly type: KNXAddressType;
    readonly level: KNXAddressLevel;
    readonly length: number;
    private _address;
    constructor(address: number, type?: KNXAddressType, level?: KNXAddressLevel);
    static get TYPE_INDIVIDUAL(): KNXAddressType;
    static get TYPE_GROUP(): KNXAddressType;
    static createFromString(address: string | number, type?: KNXAddressType): KNXAddress;
    static createFromBuffer(buffer: Buffer, offset?: number, type?: KNXAddressType): KNXAddress;
    set(address: number): void;
    get(): number;
    toString(): string;
    toBuffer(): Buffer;
}
