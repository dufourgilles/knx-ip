"use strict";
const EventEmitter = require('events').EventEmitter;

const KNXClient = require("./KNXClient");
const KNXAddress = require("./protocol/KNXAddress");

class KNXTunnelSocket extends EventEmitter {
    /**
     *
     * @param {string} srcAddress="15.15.200" - knx src address
     */
    constructor(srcAddress = null) {
        super();
        this._knxClient = new KNXClient();
        this._connectionCB = null;
        this._disconnectCB = null;
        this._monitoringBus = false;
        this._connected = false;
        this._srcAddress = srcAddress == null ? new KNXAddress("15.15.200") : new KNXAddress(srcAddress);
        this._handleBusEvent = this._handleBusEvent.bind(this);
        this._init();
    }

    _init() {
        this._knxClient.on("connected", () => {
            if (this._connectionCB != null) {
                this._connectionCB();
            }
        }).on("error", err => {
            console.log("received error", err);
            if (err == null) { return; }
            if (this._connectionCB != null) {
                this._connectionCB(err);
            } else if (this._disconnectCB != null) {
                this._disconnectCB(err);
            }
        }).on("disconnected", () => {
            this._connected = false;
            if (this._disconnectCB != null) {
                this._disconnectCB();
            }
        })
    }

    /**
     * tunnel channel id
     * @returns {number}
     */
    get channelID() {
        return this._knxClient.channelID;
    }

    /**
     * Close the tunnel
     */
    close() {
        this._knxClient.close();
    }

    /**
     * Open tunnel to gateway
     * @param {string} host - destination ip address
     * @param {number} port - destination port
     * @returns {Promise}
     */
    connect(host, port) {
        if (this._connected) { return Promise.reject("Already connected");}
        this._host = host;
        this._port = port;
        return new Promise((resolve, reject) => {
            this._connectionCB = err => {
                this._connectionCB = null;
                if (err != null) {
                    reject(err);
                }
                else {
                    resolve();
                }
            };
            try {
                this._knxClient.openTunnelConnection(host, port);
            } catch(err) {
                reject(err);
            }
        });
    }

    /**
     * Disconnect tunnel
     * @returns {Promise}
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            this._disconnectCB = err => {
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
     * @param {Buffer} data - data to write
     * @returns {Promise}
     */
    write(dstAddress, data) {
        return new Promise((resolve, reject) => {
            this._knxClient.sendWriteRequest(this._srcAddress, dstAddress, data, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }

    /**
     * Read data from a knx component
     * @param {KNXAddress} dstAddress - knx address ie: 1.1.15
     * @returns {Promise<Buffer>}
     */
    read(dstAddress) {
        return new Promise((resolve, reject) => {
            this._knxClient.sendReadRequest(this._srcAddress, dstAddress, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }

    /**
     *
     * @param {KNXAddress} srcAddress
     * @param {KNXAddress} dstAddress
     * @param {NPDU} npdu
     * @private
     */
    _handleBusEvent(srcAddress, dstAddress, npdu) {
        this.emit("indication", srcAddress, dstAddress, npdu);
    }

    /**
     * Start bus monitoring.
     * The socket will emit "indication" in the form (srcAddress, dstAddress, NPDU)
     */
    monitorBus() {
        if (this._knxClient.isConnected() === false) {
            throw new Error("Socket not connected");
        }
        if (this._monitoringBus) { return; }
        this._monitoringBus = true;
        this._knxClient.on("indication", this._handleBusEvent);
    }

    /**
     *
     */
    stopBusMonitor() {
        if (this._knxClient.isConnected() === false) {
            throw new Error("Socket not connected");
        }
        if (this._monitoringBus === false) {
            return;
        }
        this._monitoringBus = false;
        this._knxClient.off("indication", this._handleBusEvent)
    }
}

module.exports = KNXTunnelSocket;