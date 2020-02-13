'use strict';

import { Encoder, Decoder, DPT } from './definitions';

import {DPT1} from './DPT1';
import {DPT2} from './DPT2';
import {DPT3} from './DPT3';
import {DPT5} from './DPT5';
import {DPT9} from './DPT9';
import {DPT10} from './DPT10';
import {DPT11} from './DPT11';
import {DPT14} from './DPT14';
import {DPT18} from './DPT18';

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
    static get TYPES(): {[index: string]: DPT | null } {
        return {
            DPT1,
            DPT2,
            DPT3,
            DPT4: null,
            DPT5,
            DPT6: null,
            DPT7: null,
            DPT8: null,
            DPT9,
            DPT10,
            DPT11,
            DPT12: null,
            DPT13: null,
            DPT14,
            DPT15: null,
            DPT16: null,
            DPT17: null,
            DPT18,
            DPT19: null,
            DPT20: null
        };
    }

    constructor(private _type: string, private _subtype: string, private _encoder: Encoder, private _decoder: Decoder) {
    }

    static validType(text: string): boolean {
        const m = text.toUpperCase().match(/(?:DPT)?(\d+)(\.(\d+))?/);
        return m != null;
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
