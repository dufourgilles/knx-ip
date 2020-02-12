'use strict';
import {KNX_CONSTANTS} from './KNXConstants';
import KNXPacket from './KNXPacket';
import {HPAI} from './HPAI';
import CRIFactory from './CRIFactory';
import { CRI } from './CRI';

export = class KNXConnectRequest extends KNXPacket {
    constructor(readonly cri: CRI, readonly hpaiControl: HPAI = HPAI.NULLHPAI, readonly hpaiData: HPAI = HPAI.NULLHPAI) {
        super(KNX_CONSTANTS.CONNECT_REQUEST, hpaiControl.length + hpaiData.length + cri.length);
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): KNXConnectRequest {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const hpaiControl = HPAI.createFromBuffer(buffer, offset);
        offset += hpaiControl.length;
        const hpaiData = HPAI.createFromBuffer(buffer, offset);
        offset += hpaiData.length;
        const cri = CRIFactory.createFromBuffer(buffer, offset);
        return new KNXConnectRequest(cri, hpaiControl, hpaiData);
    }

    /**
     *
     * @returns {Buffer}
     */
    toBuffer(): Buffer {
        return Buffer.concat([
            this.header.toBuffer(),
            this.hpaiControl.toBuffer(),
            this.hpaiData.toBuffer(),
            this.cri.toBuffer()]);
    }
};
