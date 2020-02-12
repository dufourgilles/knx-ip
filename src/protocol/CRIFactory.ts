'use strict';
import {KNX_CONSTANTS} from './KNXConstants';
import {TunnelCRI} from './TunnelCRI';
import { CRI } from './CRI';

export = class CRIFactory {
    static createFromBuffer(buffer: Buffer, offset: number): CRI {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error('Buffer too short');
        }
        offset += 1;
        const connectionType =  buffer.readUInt8(offset++);
        switch (connectionType) {
            case KNX_CONSTANTS.TUNNEL_CONNECTION:
                return TunnelCRI.createFromBuffer(buffer, offset);
        }
    }
};
