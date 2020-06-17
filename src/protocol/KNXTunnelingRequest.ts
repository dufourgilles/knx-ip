'use strict';
import {KNXPacket} from './KNXPacket';
import {KNX_CONSTANTS} from './KNXConstants';
import {CEMIFactory} from './cEMI/CEMIFactory';
import {CEMIMessage} from './cEMI/CEMIMessage';

export class KNXTunnelingRequest extends KNXPacket {
    constructor(readonly channelID: number, readonly seqCounter: number, readonly cEMIMessage: CEMIMessage) {
        super(KNX_CONSTANTS.TUNNELING_REQUEST, 4 + cEMIMessage.length);
    }

    static parseCEMIMessage(buffer: Buffer, offset: number): CEMIMessage {
        if (offset > buffer.length) {
            throw new Error('Buffer too short');
        }
        const msgCode =  buffer.readUInt8(offset++);
        return CEMIFactory.createFromBuffer(msgCode, buffer, offset);
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): KNXTunnelingRequest {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error('Buffer too short');
        }
        offset += 1;
        const channelID =  buffer.readUInt8(offset++);
        const seqCounter =  buffer.readUInt8(offset++);
        // skip reserved byte
        offset++;
        const cEMIMessage = this.parseCEMIMessage(buffer, offset);
        return new KNXTunnelingRequest(channelID, seqCounter, cEMIMessage);
    }

    toBuffer(): Buffer {
        const buffer = Buffer.alloc(4);
        // structure length
        buffer.writeUInt8(4, 0);
        buffer.writeUInt8(this.channelID, 1);
        buffer.writeUInt8(this.seqCounter, 2);
        // reserved byte
        buffer.writeUInt8(0, 3);
        return Buffer.concat([this.header.toBuffer(), buffer, this.cEMIMessage.toBuffer()]);
    }
}
