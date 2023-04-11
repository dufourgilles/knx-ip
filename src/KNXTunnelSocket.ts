'use strict';
import {EventEmitter} from 'events';
import {KNXClient} from './KNXClient';
import {KNXAddress} from './protocol/KNXAddress';
import {KNXDataBuffer} from './protocol/KNXDataBuffer';
import {NPDU} from './protocol/cEMI/NPDU';
import {KNX_CONSTANTS} from './protocol/KNXConstants';
import {KNXSocketOptions} from './KNXSocketOptions';
import {networkInterfaces } from 'os';

export enum KNXTunnelSocketEvents {
    disconnected = 'disconnected',
    discover = 'discover',
    indication = 'indication',
    error = 'error'
}

enum ConnectionState {
    disconnected,
    connecting,
    connected
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
    private _connectionState: ConnectionState = ConnectionState.disconnected;
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
    async connectAsync(host: string, port: number): Promise<void> {
        if (this._connectionState !== ConnectionState.disconnected) {
            throw new Error('Already connected');
        }
        this._connectionState = ConnectionState.connecting;
        this._host = host;
        this._port = port;
        return new Promise((resolve, reject) => {
            this._connectionCB = err => {
                this._connectionCB = null;
                if (err != null) {
                    this._connectionState = ConnectionState.disconnected;
                    reject(err);
                } else {
                    this._connectionState = ConnectionState.connected;
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
            this._connectionState = ConnectionState.disconnected;
            this._knxClient.disconnect(this._host, this._port);
        });
    }

    /**
     * Write data to a KNX component
     * @param {KNXAddress} dstAddress - knx address ie: 1.1.15
     * @param {KNXDataBuffer} data - data to write
     * @returns {Promise}
     */
    async writeAsync(dstAddress: KNXAddress, data: KNXDataBuffer): Promise<void> {
        this.checkConnectionState();
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
        this.checkConnectionState();
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
     *
     * @param {ip | interface name} host
     * @param {number} port
     * @emit discover
     */
    async startDiscovery(ifaceName: string, port: number): Promise<void>;
    async startDiscovery(ip: string, port = KNX_CONSTANTS.KNX_PORT): Promise<void> {
        const ipv4Match = ip.match(/^\d+\.\d+\.\d+\.\d+$/);
        const hostAddress = ipv4Match ? ip : this.getInterfaceIPAddress(ip);
        await this.bindSocketPortAsync(port, hostAddress);
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

    private checkConnectionState(): void {
        if (this._connectionState !== ConnectionState.connected) {
            if (this._connectionState === ConnectionState.connecting) {
                throw new Error('You must wait for connection to be established.');
            } else {
                throw new Error('Not connected.');
            }
        }
    }

    private getInterfaceIPAddress(ifname: string): string {
        const ifaces = networkInterfaces();
        const iface = ifaces[ifname];
        if (iface == null) {
            throw new Error(`Unknown interface ${ifname}`);
        }
        for (const address of iface) {
            if (address.family === 'IPv4') {
                return address.address;
            }
        }
        throw new Error(`No IPV4 address on interface ${ifname}`);
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
            this._connectionState = ConnectionState.disconnected;
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
