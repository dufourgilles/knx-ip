'use strict';

import {DataPointType} from '../DataPointTypes/DataPointType';
import {KNXAddress} from '../protocol/KNXAddress';
import KNXDataBuffer from '../protocol/KNXDataBuffer';
import { DPT10Value } from '../DataPointTypes/DPT10';
import { DPT3Value } from '../DataPointTypes/DPT3';
import { DPT18Value } from '../DataPointTypes/DPT18';
import { DPTActions } from '../DataPointTypes/definitions';
import { KNXTunnelSocket } from '../KNXTunnelSocket';

const UNKOWN_VALUE = 'n/a';

export class DataPoint {
    protected _knxTunnelSocket: KNXTunnelSocket;
    protected _value: any;
    protected _actions: DPTActions;
    constructor(private _ga: KNXAddress, private _type: DataPointType) {
        this._knxTunnelSocket = null;
        this._value = UNKOWN_VALUE;
    }

    static get UNKOWN_VALUE(): string {
        return UNKOWN_VALUE;
    }

    get id(): string {
        return this._ga.toString();
    }

    get value(): any {
        return this._value;
    }

    get type(): DataPointType {
        return this._type;
    }

    bind(knxTunnelSocket: KNXTunnelSocket): void {
        this._knxTunnelSocket = knxTunnelSocket;
    }

    async read(): Promise<any> {
        if (this._knxTunnelSocket == null) {
            throw new Error('Datapoint not binded');
        }
        const buf: Buffer = await this._knxTunnelSocket.readAsync(this._ga);
        this._value = this._type.decode(buf);
        return this._value;
    }

    /**
     * Set datapoint value - only for writeable datapoint
     * @param {number|DPT10Value|DPT3Value|Date|DPT18Value} val
     * @returns {Promise}
     */
    async write(val: string|number|DPT10Value|DPT3Value|Date|DPT18Value|null = null): Promise<void> {
        if (this._knxTunnelSocket == null) {
            throw new Error('Datapoint not binded');
        }
        const value = val == null ? this._value : val;
        const buf = this._type.encode(value);
        await this._knxTunnelSocket.writeAsync(this._ga, buf);
    }
}
