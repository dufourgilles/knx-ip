"use strict";

const DataPointType = require("../DataPointTypes/DataPointType");
const KNXAddress = require("../protocol/KNXAddress");

const UNKOWN_VALUE = "n/a";

function _getDataPointTypeClass(type, subtype) {
    const dataPointTypeName = DataPointType.getDataPointType(type, subtype);
    const DataPointClassName = `${dataPointTypeName[0].toUpperCase()}${dataPointTypeName.slice(1)}`;
    const DataPointClass = require(`./${DataPointClassName}`);
    return DataPointClass;
}

function _getDataPointTypeFromString(type) {
    let m = type.split("-");
    if (m.length === 2) {
        m.push("001");
    }
    if (m.length === 3) {
        return _getDataPointTypeClass(m[1], m[2]);
    }
}

class DataPoint {
    /**
     *
     * @param {KNXAddress} ga - KNX group address
     * @param {DataPointType} type
     */
    constructor(ga, type) {
        this._ga = ga;
        this._type = type;
        this.status = UNKOWN_VALUE;
        this.name = "";
        this.description = "";
        this._knxName = "";
        this._knxID = "";
        this._knxAddress = "";
        this._knxGroupName = "";
        this._knxTunnelSocket = null;
        this._value = UNKOWN_VALUE;
    }

    static get UNKOWN_VALUE() {
        return UNKOWN_VALUE;
    }

    /**
     *
     * @returns {string}
     */
    get id() {
        return this._ga.toString();
    }

    /**
     *
     * @returns {T}
     */
    get value() {
        return this._value;
    }

    /**
     *
     * @returns {string}
     */
    get knxName() {
        return this._knxName;
    }

    /**
     *
     * @returns {string}
     */
    get knxID() {
        return this._knxID;
    }

    /**
     *
     * @returns {string}
     */
    get knxGroupName() {
        return this._knxGroupName;
    }

    /**
     *
     * @returns {string}
     */
    get knxAddress() {
        return this._knxAddress;
    }

    /**
     *
     * @returns {DataPointType}
     */
    get type() {
        return this._type;
    }

    /**
     *
     * @param {KNXTunnelSocket} knxTunnelSocket
     */
    bind(knxTunnelSocket) {
        this._knxTunnelSocket = knxTunnelSocket;
    }

    /**
     * Retrieve knx datapoint value - only for readable datapoint
     * @returns {Promise}
     */
    read() {
        if (this._knxTunnelSocket == null) {
            return Promise.reject(new Error("Datapoint not binded"));
        }
        return this._knxTunnelSocket.read(this._ga)
            .then(buf => this._type.decode(buf))
            .then(val => {
                this._value = val;
                return val;
            });
    }

    /**
     * Set datapoint value - only for writeable datapoint
     * @param val
     * @returns {Promise<never>|Promise<void>}
     */
    write(val = null) {
        if (this._knxTunnelSocket == null) {
            return Promise.reject(new Error("Datapoint not binded"));
        }
        return Promise.resolve().then(() => {
            const value = val == null ? this._value : val;
            const buf = this._type.encode(value);
            return this._knxTunnelSocket.write(this._ga, buf);
        });
    }

}

module.exports = DataPoint;
