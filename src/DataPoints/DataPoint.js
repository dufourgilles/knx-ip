"use strict";

const DataPointType = require("../DataPointTypes/DataPointType");
const KNXAddress = require("../protocol/KNXAddress");

const UNKOWN_VALUE = "n/a";

function _getDataPointTypeClass(typeName) {
    const dataPointTypeName = DataPointType.getDataPointType(type, subtype);
    const DataPointClassName = `${dataPointTypeName[0].toUpperCase()}${dataPointTypeName.slice(1)}`;
    const DataPointClass = require(`./${DataPointClassName}`);
    return DataPointClass;
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
     * @param {number|DPT10Value|DPT3Value|Date|DPT18Value} val
     * @returns {Promise}
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

    /**
     *
     * @param {KNXAddress} ga
     * @param {string} typeName
     * @returns {DataPoint}
     */
    static createDataPoint(ga, typeName) {
        /** @type {string} */
        const DataPointClassName = `${typeName[0].toUpperCase()}${typeName.slice(1).toLowerCase()}`;
        let DataPointClass;
        try {
            DataPointClass = require(`./${DataPointClassName}`);
        }
        catch(e) {
            throw new Error(`Unknown DataPoint type ${typeName}`);
        }
        return new DataPointClass(ga);
    }
}

module.exports = DataPoint;
