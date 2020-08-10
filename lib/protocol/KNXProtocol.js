'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXProtocol = void 0;
const KNXConstants_1 = require("./KNXConstants");
const KNXHeader_1 = require("./KNXHeader");
const KNXSearchRequest_1 = require("./KNXSearchRequest");
const KNXSearchResponse_1 = require("./KNXSearchResponse");
const KNXDescriptionRequest_1 = require("./KNXDescriptionRequest");
const KNXDescriptionResponse_1 = require("./KNXDescriptionResponse");
const KNXConnectRequest_1 = require("./KNXConnectRequest");
const KNXConnectResponse_1 = require("./KNXConnectResponse");
const KNXConnectionStateRequest_1 = require("./KNXConnectionStateRequest");
const KNXConnectionStateResponse_1 = require("./KNXConnectionStateResponse");
const KNXDisconnectRequest_1 = require("./KNXDisconnectRequest");
const KNXDisconnectResponse_1 = require("./KNXDisconnectResponse");
const KNXTunnelingRequest_1 = require("./KNXTunnelingRequest");
const KNXTunnelingAck_1 = require("./KNXTunnelingAck");
const HPAI_1 = require("./HPAI");
class KNXProtocol {
    static parseMessage(buffer) {
        const knxHeader = KNXHeader_1.KNXHeader.createFromBuffer(buffer);
        const knxData = buffer.slice(knxHeader.headerLength);
        let knxMessage;
        switch (knxHeader.service_type) {
            case KNXConstants_1.KNX_CONSTANTS.SEARCH_REQUEST:
                knxMessage = KNXSearchRequest_1.KNXSearchRequest.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.SEARCH_RESPONSE:
                knxMessage = KNXSearchResponse_1.KNXSearchResponse.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.DESCRIPTION_REQUEST:
                knxMessage = KNXDescriptionRequest_1.KNXDescriptionRequest.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.DESCRIPTION_RESPONSE:
                knxMessage = KNXDescriptionResponse_1.KNXDescriptionResponse.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.CONNECT_REQUEST:
                knxMessage = KNXDescriptionResponse_1.KNXDescriptionResponse.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.CONNECT_RESPONSE:
                knxMessage = KNXConnectResponse_1.KNXConnectResponse.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.CONNECTIONSTATE_REQUEST:
                knxMessage = KNXConnectionStateRequest_1.KNXConnectionStateRequest.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE:
                knxMessage = KNXConnectionStateResponse_1.KNXConnectionStateResponse.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.DISCONNECT_REQUEST:
                knxMessage = KNXDisconnectRequest_1.KNXDisconnectRequest.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.DISCONNECT_RESPONSE:
                knxMessage = KNXDisconnectResponse_1.KNXDisconnectResponse.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.TUNNELING_REQUEST:
                knxMessage = KNXTunnelingRequest_1.KNXTunnelingRequest.createFromBuffer(knxData);
                break;
            case KNXConstants_1.KNX_CONSTANTS.TUNNELING_ACK:
                knxMessage = KNXTunnelingAck_1.KNXTunnelingAck.createFromBuffer(buffer);
                break;
        }
        return { knxHeader, knxMessage, knxData };
    }
    static newKNXSearchRequest(hpai) {
        return new KNXSearchRequest_1.KNXSearchRequest(hpai);
    }
    static newKNXDescriptionRequest(hpai) {
        return new KNXDescriptionRequest_1.KNXDescriptionRequest(hpai);
    }
    static newKNXConnectRequest(cri, hpaiControl = HPAI_1.HPAI.NULLHPAI, hpaiData = HPAI_1.HPAI.NULLHPAI) {
        return new KNXConnectRequest_1.KNXConnectRequest(cri, hpaiControl, hpaiData);
    }
    static newKNXConnectionStateRequest(channelID, hpaiControl = HPAI_1.HPAI.NULLHPAI) {
        return new KNXConnectionStateRequest_1.KNXConnectionStateRequest(channelID, hpaiControl);
    }
    static newKNXDisconnectRequest(channelID, hpaiControl = HPAI_1.HPAI.NULLHPAI) {
        return new KNXDisconnectRequest_1.KNXDisconnectRequest(channelID, hpaiControl);
    }
    static newKNXDisconnectResponse(channelID, status) {
        return new KNXDisconnectResponse_1.KNXDisconnectResponse(channelID, status);
    }
    static newKNXTunnelingACK(channelID, seqCounter, status) {
        return new KNXTunnelingAck_1.KNXTunnelingAck(channelID, seqCounter, status);
    }
    static newKNXTunnelingRequest(channelID, seqCounter, cEMIMessage) {
        return new KNXTunnelingRequest_1.KNXTunnelingRequest(channelID, seqCounter, cEMIMessage);
    }
}
exports.KNXProtocol = KNXProtocol;
//# sourceMappingURL=KNXProtocol.js.map