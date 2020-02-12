import {KNX_CONSTANTS} from './KNXConstants';
import { KNXAddress } from './KNXAddress';
const CRD_LENGTH = 4;

export enum ConnectionType {
    TUNNEL_CONNECTION = KNX_CONSTANTS.TUNNEL_CONNECTION,
    DEVICE_MGMT_CONNECTION = KNX_CONSTANTS.DEVICE_MGMT_CONNECTION,
    REMLOG_CONNECTION = KNX_CONSTANTS.REMLOG_CONNECTION,
    REMCONF_CONNECTION = KNX_CONSTANTS.REMCONF_CONNECTION,
    OBJSVR_CONNECTION = KNX_CONSTANTS.OBJSVR_CONNECTION
}

export class CRD {

    set knxAddress(knxAddress: KNXAddress) {
        this._knxAddress = knxAddress;
    }

    get knxAddress(): KNXAddress {
        return this._knxAddress;
    }

    get length(): number {
        return CRD_LENGTH;
    }

    set connectionType(connectionType: ConnectionType) {
        this._connectionType = connectionType;
    }

    get connectionType(): ConnectionType {
        return this._connectionType;
    }
    private _knxAddress: KNXAddress;
    private _connectionType: ConnectionType;
    constructor(connectionType: ConnectionType, knxAddress: KNXAddress) {
        this.connectionType = connectionType;
        this.knxAddress = knxAddress;
    }

    /**
     *
     * @param buffer
     * @param offset
     * @returns {CRD}
     */
    static createFromBuffer(buffer: Buffer, offset: number): CRD {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error('Buffer too short');
        }
        offset += 1;
        const connectionType =  buffer.readUInt8(offset++);
        const knxAddress = buffer.readUInt16BE(offset);
        return new CRD(connectionType, KNXAddress.createFromString(knxAddress));
    }

    toBuffer(): Buffer {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(this.connectionType, offset++);
        buffer.writeUInt16BE(this.knxAddress.get(), offset);
        return buffer;
    }
}
