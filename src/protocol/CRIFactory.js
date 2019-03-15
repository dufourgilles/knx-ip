"use strict";
const KNX_CONSTANTS = require("./KNXConstants");
const TunnelCRI = require("./TunnelCRI");

class CRIFactory {
    static fromBuffer(buffer, offset) {
        if (offset >= buffer.length) {
            throw new Error("Buffer too short");
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error("Buffer too short");
        }
        offset += 1;
        const connectionType =  buffer.readUInt8(offset++);
        switch (connectionType) {
            case KNX_CONSTANTS.TUNNEL_CONNECTION:
                return TunnelCRI.fromBuffer(buffer, offset);
        }
    }
}

module.exports = CRIFactory;

