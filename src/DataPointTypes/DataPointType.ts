'use strict';

import { Encoder, Decoder } from './definitions';

// KNX Specs
// Chapter 3/7/2 Datapoint Types

export class DataPointType {

    get type(): string {
        return this._type;
    }

    get subtype(): string {
        return this._subtype;
    }

    /**
     * @property {DPTYPE}  DPT1
     * @property {DPTYPE}  DPT2
     * @property {DPTYPE}  DPT3
     * @property {DPTYPE}  DPT4
     * @property {DPTYPE}  DPT5
     * @property {DPTYPE}  DPT6
     * @property {DPTYPE}  DPT7
     * @property {DPTYPE}  DPT8
     * @property {DPTYPE}  DPT9
     * @property {DPTYPE}  DPT10
     * @property {DPTYPE}  DPT11
     * @property {DPTYPE}  DPT12
     * @property {DPTYPE}  DPT13
     * @property {DPTYPE}  DPT14
     * @property {DPTYPE}  DPT15
     * @property {DPTYPE}  DPT16
     * @property {DPTYPE}  DPT17
     * @property {DPTYPE}  DPT18
     * @property {DPTYPE}  DPT19
     * @property {DPTYPE}  DPT20
     */
    static get TYPES(): {[index: string]: any} {
        return {
            DPT1: require('./DPT1'),
            DPT2: require('./DPT2'),
            DPT3: require('./DPT3'),
            DPT4: '4',
            DPT5: require('./DPT5'),
            DPT6: '6',
            DPT7: '7',
            DPT8: '8',
            DPT9: require('./DPT9'),
            DPT10: require('./DPT10'),
            DPT11: require('./DPT11'),
            DPT12: '12',
            DPT13: '13',
            DPT14: require('./DPT14'),
            DPT15: '15',
            DPT16: '16',
            DPT17: '17',
            DPT18: require('./DPT18'),
            DPT19: '19',
            DPT20: '20'
        };
    }

    constructor(private _type: string, private _subtype: string, private _encoder: Encoder, private _decoder: Decoder) {
    }

    static validType(text: string): boolean {
        const m = text.toUpperCase().match(/(?:DPT)?(\d+)(\.(\d+))?/);
        return m != null;
    }

    /**
     * Function to return the name of the datapoint type based on its type and subtype.
     * @param {string|number} type - example 1
     * @param {string|number} subtype - example 5 or 005 for alarm
     * @returns {string}
     */
    static getDataPointType(type: string|number, subtype: string|number): string {
        const dpt = this.TYPES[`DPT${type}`];
        if (dpt == null) {
            throw new Error(`Unknown type ${type}`);
        }
        let _3digitSubtype = `${subtype}`;
        while (_3digitSubtype.length < 3) {
            _3digitSubtype = `0${_3digitSubtype}`;
        }
        const dptSubtype = dpt.subtypes.ids[_3digitSubtype];
        if (dptSubtype == null) {
            throw new Error(`Invalid subtype ${subtype} for type DPT${type}`);
        }
        return dptSubtype;
    }

    toString(): string {
        return `${this.type}.${this.subtype}`;
    }

    decode(buffer: Buffer): string|number {
        return this._decoder(buffer);
    }

    encode(value: string|number): Buffer {
        return this._encoder(value);
    }
}
