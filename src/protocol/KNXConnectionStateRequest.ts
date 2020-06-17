'use strict';
import {KNXPacket} from './KNXPacket';
import {KNX_CONSTANTS, ConnectionStatus} from './KNXConstants';
import { HPAI } from './HPAI';

export class KNXConnectionStateRequest extends KNXPacket {
    constructor(readonly channelID: number, readonly hpaiControl: HPAI = HPAI.NULLHPAI) {
        super(KNX_CONSTANTS.CONNECTIONSTATE_REQUEST, hpaiControl.length + 2);
        this.channelID = channelID;
        this.hpaiControl = hpaiControl;
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): KNXConnectionStateRequest {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const channelID = buffer.readUInt8(offset++);
        // skip reserved byte
        offset++;
        const hpaiControl = HPAI.createFromBuffer(buffer, offset);
        return new KNXConnectionStateRequest(channelID, hpaiControl);
    }

    toBuffer(): Buffer {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(0, 1);
        return Buffer.concat([
            this.header.toBuffer(),
            buffer,
            this.hpaiControl.toBuffer()
        ]);
    }
}
