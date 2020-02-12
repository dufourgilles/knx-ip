
import KNXPacket from './KNXPacket';
import {KNX_CONSTANTS, ConnectionStatus} from './KNXConstants';

export = class KNXDisconnectResponse extends KNXPacket {
    constructor(readonly channelID: number, readonly status: ConnectionStatus) {
        super(KNX_CONSTANTS.DISCONNECT_RESPONSE, 2);
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): KNXDisconnectResponse {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const channelID = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset);
        return new KNXDisconnectResponse(channelID, status);
    }

    toBuffer(): Buffer {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(this.status, 1);
        return Buffer.concat([this.header.toBuffer(), buffer]);
    }
};
