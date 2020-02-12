
import { KNX_CONSTANTS } from './KNXConstants';
import { CRI } from './CRI';

const TUNNEL_CRI_LENGTH = 4;

export enum TunnelTypes {
    TUNNEL_LINKLAYER = KNX_CONSTANTS.TUNNEL_LINKLAYER,
    TUNNEL_RAW = KNX_CONSTANTS.TUNNEL_RAW,
    TUNNEL_BUSMONITOR = KNX_CONSTANTS.TUNNEL_BUSMONITOR
}

export class TunnelCRI extends CRI {

    /**
     *
     * @returns {number}
     */
    get length(): number {
        return TUNNEL_CRI_LENGTH;
    }
    constructor(public knxLayer: TunnelTypes) {
        super(KNX_CONSTANTS.TUNNEL_CONNECTION);
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {TunnelCRI}
     */
    static createFromBuffer(buffer: Buffer, offset: number = 0): TunnelCRI {
        const knxLayer = buffer.readUInt8(offset++);
        buffer.readUInt8(offset); // reserved
        // ignore reserved.
        return new TunnelCRI(knxLayer);
    }

    /**
     * @returns {Buffer}
     */
    toBuffer(): Buffer {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(KNX_CONSTANTS.TUNNEL_CONNECTION, offset++);
        buffer.writeUInt8(this.knxLayer, offset++);
        buffer.writeUInt8(0x00, offset);
        return buffer;
    }
}
