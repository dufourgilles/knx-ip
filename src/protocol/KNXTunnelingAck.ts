'use strict';
import {KNXPacket} from './KNXPacket';
import {KNX_CONSTANTS} from './KNXConstants';

export class KNXTunnelingAck extends KNXPacket {
    /**
     *
     * @param {number} channelID
     * @param {number} seqCounter
     * @param {number} status
     */
    constructor(readonly channelID: number, readonly seqCounter: number, readonly status: number) {
        super(KNX_CONSTANTS.TUNNELING_ACK, 4);
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): KNXTunnelingAck {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error('Buffer too short');
        }
        offset += 1;
        const channelID = buffer.readUInt8(offset++);
        const seqCounter = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset);
        return new KNXTunnelingAck(channelID, seqCounter, status);
    }

    toBuffer(): Buffer {
        const buffer = Buffer.alloc(this.length);
        buffer.writeUInt8(this.length, 0);
        buffer.writeUInt8(this.channelID, 1);
        buffer.writeUInt8(this.seqCounter, 2);
        buffer.writeUInt8(this.status, 3);
        return Buffer.concat([this.header.toBuffer(), buffer]);
    }
}
