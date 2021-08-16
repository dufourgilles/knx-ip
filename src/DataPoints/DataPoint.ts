'use strict';

import {DataPointType} from '../DataPointTypes/DataPointType';
import {KNXAddress} from '../protocol/KNXAddress';
import {KNXDataBuffer} from '../protocol/KNXDataBuffer';
import { DPT10Value } from '../DataPointTypes/DPT10';
import { DPT3Value } from '../DataPointTypes/DPT3';
import { DPT18Value } from '../DataPointTypes/DPT18';
import { DPTActions } from '../DataPointTypes/definitions';
import { KNXTunnelSocket } from '../KNXTunnelSocket';

const UNKOWN_VALUE = 'n/a';
export type IDataPoint = new (_ga: KNXAddress, typeName?: string) => DataPoint;

export class DataPoint {
    protected _knxTunnelSocket: KNXTunnelSocket;
    protected _value: any;
    protected _actions: DPTActions;
    constructor(protected _ga: KNXAddress, protected _type: DataPointType|null = null) {
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

    get type(): DataPointType|null {
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
        if (this._type) {
            this._value = this._type.decode(buf);
            return this._value;
        }
        return buf;
    }

    /**
     * Set datapoint value - only for writeable datapoint
     * @param {string|number|DPT10Value|DPT3Value|Date|DPT18Value|KNXDataBuffer} val
     * @returns {Promise}
     */
    async write(val: string|number|DPT10Value|DPT3Value|Date|DPT18Value|KNXDataBuffer|null = null): Promise<void> {
        if (this._knxTunnelSocket == null) {
            throw new Error('Datapoint not binded');
        }
        if (this._type == null && !(val instanceof KNXDataBuffer)) {
            throw new Error('Datapoint type not specified. Expecting KNXDataBuffer value');
        }
        const value = val == null ? this._value : val;
        const buf =  this._type ? new KNXDataBuffer(this._type.encode(value), this) : <KNXDataBuffer>val;
        await this._knxTunnelSocket.writeAsync(this._ga, buf);
    }
}
