'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXTunnelSocket = exports.KNXTunnelSocketEvents = void 0;
const events_1 = require("events");
const KNXClient_1 = require("./KNXClient");
const KNXAddress_1 = require("./protocol/KNXAddress");
var KNXTunnelSocketEvents;
(function (KNXTunnelSocketEvents) {
    KNXTunnelSocketEvents["disconnected"] = "disconnected";
    KNXTunnelSocketEvents["indication"] = "indication";
    KNXTunnelSocketEvents["error"] = "error";
})(KNXTunnelSocketEvents = exports.KNXTunnelSocketEvents || (exports.KNXTunnelSocketEvents = {}));
class KNXTunnelSocket extends events_1.EventEmitter {
    constructor(srcAddress = null, socketPort) {
        super();
        this._knxClient = new KNXClient_1.KNXClient();
        if (socketPort != null) {
            this._knxClient.bindSocketPort(socketPort);
        }
        this._connectionCB = null;
        this._disconnectCB = null;
        this._monitoringBus = false;
        this._connected = false;
        this._srcAddress = srcAddress == null ? KNXAddress_1.KNXAddress.createFromString('15.15.200') : KNXAddress_1.KNXAddress.createFromString(srcAddress);
        this._handleBusEvent = this._handleBusEvent.bind(this);
        this._init();
    }
    get channelID() {
        return this._knxClient.channelID;
    }
    bindSocketPort(port) {
        if (this._knxClient.isConnected() === true) {
            return Promise.reject('Socket already connected');
        }
        return new Promise((resolve, reject) => {
            try {
                this._knxClient.bindSocketPort(port);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    close() {
        this._knxClient.close();
    }
    connectAsync(host, port) {
        if (this._connected) {
            return Promise.reject('Already connected');
        }
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
            }
            catch (err) {
                reject(err);
            }
        });
    }
    disconnectAsync() {
        return new Promise((resolve, reject) => {
            this._disconnectCB = (err) => {
                this._disconnectCB = null;
                if (err != null) {
                    reject(err);
                }
                resolve();
            };
            this._knxClient.disconnect(this._host, this._port);
        });
    }
    writeAsync(dstAddress, data) {
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
    readAsync(dstAddress) {
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
    monitorBus() {
        if (this._knxClient.isConnected() === false) {
            throw new Error('Socket not connected');
        }
        if (this._monitoringBus) {
            return;
        }
        this._monitoringBus = true;
        this._knxClient.on(KNXTunnelSocketEvents.indication, this._handleBusEvent);
    }
    stopBusMonitor() {
        if (this._knxClient.isConnected() === false) {
            throw new Error('Socket not connected');
        }
        if (this._monitoringBus === false) {
            return;
        }
        this._monitoringBus = false;
        this._knxClient.off(KNXTunnelSocketEvents.indication, this._handleBusEvent);
    }
    _init() {
        this._knxClient.on(KNXClient_1.KNXClient.KNXClientEvents.connected, () => {
            if (this._connectionCB != null) {
                this._connectionCB();
            }
        }).on(KNXClient_1.KNXClient.KNXClientEvents.error, (err) => {
            if (err == null) {
                return;
            }
            if (this._connectionCB != null) {
                this._connectionCB(err);
            }
            else if (this._disconnectCB != null) {
                this._disconnectCB(err);
            }
        }).on(KNXClient_1.KNXClient.KNXClientEvents.disconnected, () => {
            this._connected = false;
            if (this._disconnectCB != null) {
                this._disconnectCB();
            }
            this.emit(KNXTunnelSocketEvents.disconnected);
        });
    }
    _handleBusEvent(srcAddress, dstAddress, npdu) {
        this.emit(KNXTunnelSocketEvents.indication, srcAddress, dstAddress, npdu);
    }
}
exports.KNXTunnelSocket = KNXTunnelSocket;
KNXTunnelSocket.KNXTunnelSocketEvents = KNXTunnelSocketEvents;
//# sourceMappingURL=KNXTunnelSocket.js.map