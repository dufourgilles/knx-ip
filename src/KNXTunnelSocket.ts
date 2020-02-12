'use strict';
import {EventEmitter} from 'events'; )

const KNXClient = require('./KNXClient');
import {KNXAddress} from './protocol/KNXAddress';
import KNXDataBuffer = require('./protocol/KNXDataBuffer');

export const KNXTunnelSocketEvents = {
    indication: 'indication'
};

export class KNXTunnelSocket extends EventEmitter {

    get channelID(): number {
        return this._knxClient.channelID;
    }
    private _knxClient: KNXClient;
    private _connectionCB: (e?: Error) => void;
    private _disconnectCB: (e?: Error) => void;
    private _monitoringBus: boolean;
    private _connected: boolean;
    private _srcAddress: KNXAddress|null;
    private _host: string;
    private _port: number;
    constructor(srcAddress: string = null) {
        super();
        this._knxClient = new KNXClient();
        this._connectionCB = null;
        this._disconnectCB = null;
        this._monitoringBus = false;
        this._connected = false;
        this._srcAddress = srcAddress == null ? KNXAddress.createFromString('15.15.200') : KNXAddress.createFromString(srcAddress);
        this._handleBusEvent = this._handleBusEvent.bind(this);
        this._init();
    }

    close(): void {
        this._knxClient.close();
    }

    connectAsync(host: string, port: number): Promise<void> {
        if (this._connected) { return Promise.reject('Already connected'); }
        this._host = host;
        this._port = port;
        return new Promise((resolve, reject) => {
            this._connectionCB = err => {
                this._connectionCB = null;
                if (err != null) {
                    reject(err);
                } else {
                    resolve();
                }
            };
            try {
                this._knxClient.openTunnelConnection(host, port);
            } catch (err) {
                reject(err);
            }
        });
    }

    disconnectAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._disconnectCB = (err: Error) => {
                this._disconnectCB = null;
                if (err != null) {
                    reject(err);
                }
                resolve();
            };
            this._knxClient.disconnect(this._host, this._port);
        });
    }

    /**
     * Write data to a knx component
     * @param {KNXAddress} dstAddress - knx address ie: 1.1.15
     * @param {KNXDataBuffer} data - data to write
     * @returns {Promise}
     */
    writeAsync(dstAddress: KNXAddress, data: KNXDataBuffer): Promise<void> {
        return new Promise((resolve, reject) => {
            this._knxClient.sendWriteRequest(this._srcAddress, dstAddress, data, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    readAsync(dstAddress: KNXAddress): Promise<void> {
        return new Promise((resolve, reject) => {
            this._knxClient.sendReadRequest(this._srcAddress, dstAddress, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Start bus monitoring.
     * The socket will emit "indication" events
     */
    monitorBus(): void {
        if (this._knxClient.isConnected() === false) {
            throw new Error('Socket not connected');
        }
        if (this._monitoringBus) { return; }
        this._monitoringBus = true;
        this._knxClient.on(KNXTunnelSocketEvents.indication, this._handleBusEvent);
    }

    /**
     *
     */
    stopBusMonitor(): void {
        if (this._knxClient.isConnected() === false) {
            throw new Error('Socket not connected');
        }
        if (this._monitoringBus === false) {
            return;
        }
        this._monitoringBus = false;
        this._knxClient.off(KNXTunnelSocketEvents.indication, this._handleBusEvent);
    }

    private _init(): void {
        this._knxClient.on('connected', () => {
            if (this._connectionCB != null) {
                this._connectionCB();
            }
        }).on('error', (err: Error) => {
            if (err == null) { return; }
            if (this._connectionCB != null) {
                this._connectionCB(err);
            } else if (this._disconnectCB != null) {
                this._disconnectCB(err);
            }
        }).on('disconnected', () => {
            this._connected = false;
            if (this._disconnectCB != null) {
                this._disconnectCB();
            }
        });
    }

    /**
     * @fires KNXTunnelSocket#indication
     * @param {KNXAddress} srcAddress
     * @param {KNXAddress} dstAddress
     * @param {NPDU} npdu
     * @private
     */
    private _handleBusEvent(srcAddress: KNXAddress, dstAddress: KNXAddress, npdu: NPDU): void {
        /**
         * @event KNXTunnelSocket#indication
         * @param {KNXAddress} src
         * @param {KNXAddress} dest
         * @param {NPDU} npdu
         */
        this.emit(KNXTunnelSocketEvents.indication, srcAddress, dstAddress, npdu);
    }
}
