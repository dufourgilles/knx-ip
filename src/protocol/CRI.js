"use strict";
const KNX_CONSTANTS = require("./KNXConstants");

class CRI {
    /**
     *
     * @param {number} connectionType
     */
    constructor(connectionType) {
        this.connectionType = connectionType;
    }

    /**
     *
     * @returns {number}
     */
    get length() {
        return 2;
    }

    /**
     *
     * @param {number} connectionType
     */
    set connectionType(connectionType) {
        const _connectionType = Number(connectionType);
        if (_connectionType !== KNX_CONSTANTS.TUNNEL_CONNECTION &&
            _connectionType !== KNX_CONSTANTS.DEVICE_MGMT_CONNECTION &&
            _connectionType !== REMLOG_CONNECTION &&
            _connectionType !== REMCONF_CONNECTION &&
            _connectionType !== OBJSVR_CONNECTION) {
            throw new Error(`Invalid connection type ${connectionType}`);
        }
        this._connectionType = _connectionType;
    }

    /**
     *
     * @returns {number}
     */
    get connectionType() {
        return this._connectionType;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer() {
        return new Buffer();
    }
}

module.exports = CRI;

