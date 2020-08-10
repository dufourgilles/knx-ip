'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPoint = void 0;
const KNXDataBuffer_1 = require("../protocol/KNXDataBuffer");
const UNKOWN_VALUE = 'n/a';
class DataPoint {
    constructor(_ga, _type) {
        this._ga = _ga;
        this._type = _type;
        this._knxTunnelSocket = null;
        this._value = UNKOWN_VALUE;
    }
    static get UNKOWN_VALUE() {
        return UNKOWN_VALUE;
    }
    get id() {
        return this._ga.toString();
    }
    get value() {
        return this._value;
    }
    get type() {
        return this._type;
    }
    bind(knxTunnelSocket) {
        this._knxTunnelSocket = knxTunnelSocket;
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._knxTunnelSocket == null) {
                throw new Error('Datapoint not binded');
            }
            const buf = yield this._knxTunnelSocket.readAsync(this._ga);
            this._value = this._type.decode(buf);
            return this._value;
        });
    }
    write(val = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._knxTunnelSocket == null) {
                throw new Error('Datapoint not binded');
            }
            const value = val == null ? this._value : val;
            const buf = new KNXDataBuffer_1.KNXDataBuffer(this._type.encode(value), this);
            yield this._knxTunnelSocket.writeAsync(this._ga, buf);
        });
    }
}
exports.DataPoint = DataPoint;
//# sourceMappingURL=DataPoint.js.map