'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXConnectRequest = void 0;
const KNXConstants_1 = require("./KNXConstants");
const KNXPacket_1 = require("./KNXPacket");
const HPAI_1 = require("./HPAI");
const CRIFactory_1 = __importDefault(require("./CRIFactory"));
class KNXConnectRequest extends KNXPacket_1.KNXPacket {
    constructor(cri, hpaiControl = HPAI_1.HPAI.NULLHPAI, hpaiData = HPAI_1.HPAI.NULLHPAI) {
        super(KNXConstants_1.KNX_CONSTANTS.CONNECT_REQUEST, hpaiControl.length + hpaiData.length + cri.length);
        this.cri = cri;
        this.hpaiControl = hpaiControl;
        this.hpaiData = hpaiData;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const hpaiControl = HPAI_1.HPAI.createFromBuffer(buffer, offset);
        offset += hpaiControl.length;
        const hpaiData = HPAI_1.HPAI.createFromBuffer(buffer, offset);
        offset += hpaiData.length;
        const cri = CRIFactory_1.default.createFromBuffer(buffer, offset);
        return new KNXConnectRequest(cri, hpaiControl, hpaiData);
    }
    toBuffer() {
        return Buffer.concat([
            this.header.toBuffer(),
            this.hpaiControl.toBuffer(),
            this.hpaiData.toBuffer(),
            this.cri.toBuffer()
        ]);
    }
}
exports.KNXConnectRequest = KNXConnectRequest;
//# sourceMappingURL=KNXConnectRequest.js.map