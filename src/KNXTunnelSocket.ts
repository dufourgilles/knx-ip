'use strict';
import {EventEmitter} from 'events';
import {KNXClient} from './KNXClient';
import {KNXAddress} from './protocol/KNXAddress';
import {KNXDataBuffer} from './protocol/KNXDataBuffer';
import {NPDU} from './protocol/cEMI/NPDU';
import {KNX_CONSTANTS} from './protocol/KNXConstants';
import {KNXSocketOptions} from './KNXSocketOptions';

export enum KNXTunnelSocketEvents {
    disconnected = 'disconnected',
    discover = 'discover',
    indication = 'indication',
    error = 'error'
}

const optionsDefaults: KNXSocketOptions = {
    srcAddress: KNXAddress.createFromString('15.15.200'),
    connectionKeepAliveTimeout: KNX_CONSTANTS.CONNECTION_ALIVE_TIME
};

export class KNXTunnelSocket extends EventEmitter {
    get channelID(): number {
        return this._knxClient.channelID;
    }
    static KNXTunnelSocketEvents = KNXTunnelSocketEvents;
    static Port = KNX_CONSTANTS.KNX_PORT;
    private readonly _options: KNXSocketOptions;
    private _knxClient: KNXClient;
    private _connectionCB: (e?: Error) => void;
    private _disconnectCB: (e?: Error) => void;
    private _monitoringBus: boolean;
    private _connected: boolean;
    private _host: string;
    private _port: number;
    /**
     *
     * @param {KNXSocketOptions} options - Configuration options
     */
    constructor(options: Partial<KNXSocketOptions> | string = {}) {
        super();

        // Make sure we are backwards compatible. A string address value can be passed as first argument.
        if (typeof options === 'string') {
            options = {
                srcAddress: KNXAddress.createFromString(options)
            };
        }

        this._options = Object.assign(optionsDefaults, options);
        this._knxClient = new KNXClient(this._options);
        this._processDiscoredHost = this._processDiscoredHost.bind(this);
        this._connectionCB = null;
        this._disconnectCB = null;
        this._monitoringBus = false;
        this._connected = false;
        this._handleBusEvent = this._handleBusEvent.bind(this);
        this._init();
    }

    /**
     *
     * @param {number = 3671} port - local port
     * @param {string = '0.0.0.0} host - local IP
     */
    async bindSocketPortAsync(port = KNX_CONSTANTS.KNX_PORT, host= '0.0.0.0'): Promise<void> {
        if (this._knxClient.isConnected() === true) { throw new Error('Socket already connected'); }
        await this._knxClient.bindSocketPortAsync(port, host);
    }

    /**
     *
     */
    close(): void {
        this._knxClient.close();
    }

    /**
     *
     * @param {string} host - destination ip address
     * @param {number} port - destination port
     */
    connectAsync(host: string, port: number): Promise<void> {
        if (this._connected) {
            return Promise.reject(new Error('Already connected'));
        }
        this._host = host;
        this._port = port;
        return new Promise((resolve, reject) => {
            this._connectionCB = err => {
                this._connectionCB = null;
                if (err != null) {
                    reject(err);
                } else {
                    this._knxClient.startHeartBeat();
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

    /**
     *
     */
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
     * Write data to a KNX component
     * @param {KNXAddress} dstAddress - knx address ie: 1.1.15
     * @param {KNXDataBuffer} data - data to write
     * @returns {Promise}
     */
    writeAsync(dstAddress: KNXAddress, data: KNXDataBuffer): Promise<void> {
        return new Promise((resolve, reject) => {
            this._knxClient.sendWriteRequest(this._options.srcAddress, dstAddress, data, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Read from a KNX component
     * @param {KNXAddress} dstAddress
     */
    readAsync(dstAddress: KNXAddress): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this._knxClient.sendReadRequest(this._options.srcAddress, dstAddress, (err: Error, data: Buffer) => {
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
     * Start KNX gateway discovery
     * @emit discover
     */
    startDiscovery(): void {
        this._knxClient.startDiscovery();
    }

    /**
     *
     */
    stopDiscovery(): void {
        this._knxClient.stopDiscovery();
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

    private _processDiscoredHost(rinfo: string): void {
        this.emit(KNXTunnelSocketEvents.discover, rinfo);
    }

    private _init(): void {
        this._knxClient.on(KNXClient.KNXClientEvents.connected, () => {
            if (this._connectionCB != null) {
                this._connectionCB();
            }
        }).on(KNXClient.KNXClientEvents.error, (err: Error) => {
            if (err == null) { return; }
            if (this._connectionCB != null) {
                this._connectionCB(err);
            } else if (this._disconnectCB != null) {
                this._disconnectCB(err);
            }
        }).on(KNXClient.KNXClientEvents.disconnected, () => {
            this._connected = false;
            if (this._disconnectCB != null) {
                this._disconnectCB();
            }
            this.emit(KNXTunnelSocketEvents.disconnected);
        }).on(KNXClient.KNXClientEvents.discover, this._processDiscoredHost);
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
