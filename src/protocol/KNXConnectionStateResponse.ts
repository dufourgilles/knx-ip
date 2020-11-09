'use strict';
import {KNX_CONSTANTS, ConnectionStatus} from './KNXConstants';
import {KNXPacket} from './KNXPacket';

export class KNXConnectionStateResponse extends KNXPacket {
    /**
     *
     * @param {number} channelID
     * @param {number} status
     */
    constructor(readonly channelID: number, readonly status: ConnectionStatus) {
        super(KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE, 2);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {KNXConnectionStateResponse}
     */
    static createFromBuffer(buffer: Buffer, offset = 0): KNXConnectionStateResponse {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const channelID = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset);
        return new KNXConnectionStateResponse(channelID, status);
    }

    /**
     *
     * @param {number} status
     */
    static statusToString(status: number): string {
        switch (status) {
            case KNX_CONSTANTS.E_SEQUENCE_NUMBER:
                return 'Invalid Sequence Number';
            case KNX_CONSTANTS.E_CONNECTION_ID:
                return 'Invalid Connection ID';
            case KNX_CONSTANTS.E_CONNECTION_TYPE:
                return 'Invalid Connection Type';
            case KNX_CONSTANTS.E_CONNECTION_OPTION:
                return 'Invalid Connection Option';
            case KNX_CONSTANTS.E_NO_MORE_CONNECTIONS:
                return 'No More Connections';
            case KNX_CONSTANTS.E_DATA_CONNECTION:
                return 'Invalid Data Connection';
            case KNX_CONSTANTS.E_KNX_CONNECTION:
                return 'Invalid KNX Connection';
            case KNX_CONSTANTS.E_TUNNELING_LAYER:
                return 'Invalid Tunneling Layer';
            default:
                return `Unknown error ${status}`;
        }
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer(): Buffer {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(this.status, 1);
        return Buffer.concat([this.header.toBuffer(), buffer]);
    }
}
