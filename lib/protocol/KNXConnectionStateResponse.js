'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXConnectionStateResponse = void 0;
const KNXConstants_1 = require("./KNXConstants");
const KNXPacket_1 = require("./KNXPacket");
class KNXConnectionStateResponse extends KNXPacket_1.KNXPacket {
    constructor(channelID, status) {
        super(KNXConstants_1.KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE, 2);
        this.channelID = channelID;
        this.status = status;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const channelID = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset);
        return new KNXConnectionStateResponse(channelID, status);
    }
    toBuffer() {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(this.status, 1);
        return Buffer.concat([this.header.toBuffer(), buffer]);
    }
}
exports.KNXConnectionStateResponse = KNXConnectionStateResponse;
//# sourceMappingURL=KNXConnectionStateResponse.js.map