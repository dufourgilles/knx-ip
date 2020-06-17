'use strict';
import {KNX_CONSTANTS} from './KNXConstants';
import {KNXPacket} from './KNXPacket';
import {HPAI} from './HPAI';
import { CRD } from './CRD';

export class KNXConnectResponse extends KNXPacket {
    constructor(readonly channelID: number, readonly status: number, readonly hpai: HPAI, readonly crd: CRD) {
        super(KNX_CONSTANTS.CONNECT_RESPONSE, hpai == null ? 2 : 2 + hpai.length + crd.length);
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): KNXConnectResponse {
        if (offset + 2 > buffer.length) {
            throw new Error('Buffer too short');
        }
        const channelID = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset++);
        let hpai, crd;
        if (offset < buffer.length) {
            hpai = HPAI.createFromBuffer(buffer, offset);
            offset += hpai.length;
            crd = CRD.createFromBuffer(buffer, offset);
        }
        return new KNXConnectResponse(channelID, status, hpai, crd);
    }

    static statusToString(status: number): string {
        switch (status) {
            case KNX_CONSTANTS.E_SEQUENCE_NUMBER:
                return 'Invalid Sequence Number';
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
        if (this.hpai == null) {
            return buffer;
        }
        return Buffer.concat([buffer, this.hpai.toBuffer(), this.crd.toBuffer()]);
    }
}
