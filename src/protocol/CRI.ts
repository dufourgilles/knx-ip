import {KNX_CONSTANTS} from './KNXConstants';

export enum ConnectionTypes {
    TUNNEL_CONNECTION = KNX_CONSTANTS.TUNNEL_CONNECTION,
    DEVICE_MGMT_CONNECTION = KNX_CONSTANTS.DEVICE_MGMT_CONNECTION,
    REMLOG_CONNECTION = KNX_CONSTANTS.REMLOG_CONNECTION,
    REMCONF_CONNECTION = KNX_CONSTANTS.REMCONF_CONNECTION,
    OBJSVR_CONNECTION = KNX_CONSTANTS.OBJSVR_CONNECTION
}

export class CRI {
    constructor(private _connectionType: ConnectionTypes) {
    }

    get length(): number {
        return 2;
    }

    /**
     *
     * @param {number} connectionType
     */
    set connectionType(connectionType: ConnectionTypes) {
        this._connectionType = connectionType;
    }

    /**
     *
     * @returns {number}
     */
    get connectionType(): ConnectionTypes {
        return this._connectionType;
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer(): Buffer {
        return Buffer.alloc(0);
    }
}
