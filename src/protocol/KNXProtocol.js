"use strict";
const KNX_CONSTANTS = require("./KNXConstants");
const KNXHeader = require("./KNXHeader");
const KNXSearchRequest = require("./KNXSearchRequest");
const KNXSearchResponse = require("./KNXSearchResponse");
const KNXDescriptionRequest = require("./KNXDescriptionRequest");
const KNXDescriptionResponse = require("./KNXDescriptionResponse");
const KNXConnectRequest = require("./KNXConnectRequest");
const KNXConnectResponse = require("./KNXConnectResponse");
const KNXConnectionStateRequest = require("./KNXConnectionStateRequest");
const KNXConnectionStateResponse = require("./KNXConnectionStateResponse");
const KNXDisconnectRequest = require("./KNXDisconnectRequest");
const KNXDisconnectResponse = require("./KNXDisconnectResponse");
const KNXTunnelingRequest = require("./KNXTunnelingRequest");
const KNXTunnelingAck = require("./KNXTunnelingAck");
const KNXAddress = require("./KNXAddress");
const HPAI = require("./HPAI");
const CRI = require("./CRI");
const CRD = require("./CRD");
const DeviceInfo = require("./DeviceInfo");
const DIB = require("./DIB");
const IPCurrentConfig = require("./IPCurrentConfig");
const IPConfig = require("./IPConfig");
const TunnelCRI = require("./TunnelCRI");
const ServiceFamilies = require("./ServiceFamilies");
const CEMIFactory = require("./cEMI/CEMIFactory");
const LDataCon = require("./cEMI/LDataCon");
const LDataReq = require("./cEMI/LDataReq");
const LDataInd = require("./cEMI/LDataInd");

/**
 * KNX Protocol Elements
 */
class KNXProtocol {
    /**
     *
     * @returns {{REMLOG_CONNECTION, E_KNX_CONNECTION, KNX_ADDRESSES, KNX_PORT, IPV4_UDP, DEVICE_CONFIGURATION_REQUEST_TIMEOUT, TUNNEL_RAW, PL110, CONNECT_REQUEST, CONNECTIONSTATE_RESPONSE, KNX_IP, SEARCH_RESPONSE, TUNNEL_CONNECTION, MFR_DATA, ROUTING_INDICATION, IP, DEVICE_CONFIGURATION_ACK, DISCONNECT_REQUEST, TUNNELING_ACK, E_VERSION_NOT_SUPPORTED, E_DATA_CONNECTION, E_NO_MORE_CONNECTIONS, TP1, RF, TUNNELING_REQUEST_TIMEOUT, OBJSVR_CONNECTION, TUNNEL_BUSMONITOR, E_CONNECTION_OPTION, E_CONNECTION_ID, CONNECTION_ALIVE_TIME, SEARCH_TIMEOUT, DEVICE_MGMT_CONNECTION, ROUTING_LOST_MESSAGE, E_NO_ERROR, IP_CUR_CONFIG, IPV4_ADDRESS_LENGTH, E_SEQUENCE_NUMBER, DEVICE_CONFIGURATION_REQUEST, REMCONF_CONNECTION, TUNNEL_LINKLAYER, KNXNETIP_VERSION_10, DESCRIPTION_RESPONSE, E_CONNECTION_TYPE, TUNNELING_REQUEST, CONNECT_REQUEST_TIMEOUT, DISCONNECT_RESPONSE, DEVICE_INFO, CONNECTIONSTATE_REQUEST, SEARCH_REQUEST, CONNECT_RESPONSE, E_HOST_PROTOCOL_TYPE, HEADER_SIZE_10, IPV4_TCP, DESCRIPTION_REQUEST, CONNECTIONSTATE_REQUEST_TIMEOUT, E_TUNNELING_LAYER, SUPP_SVC_FAMILIES, IP_CONFIG}}
     * @constructor
     */
    static get KNX_CONSTANTS() {return KNX_CONSTANTS; }

    /**
     *
     * @returns {KNXHeader}
     * @constructor
     */
    static get KNXHeader() { return KNXHeader;}

    /**
     *
     * @returns {KNXSearchRequest}
     * @constructor
     */
    static get KNXSearchRequest() { return KNXSearchRequest; }

    /**
     *
     * @returns {KNXSearchResponse}
     * @constructor
     */
    static get KNXSearchResponse() { return KNXSearchResponse;}

    /**
     *
     * @returns {KNXDescriptionRequest}
     * @constructor
     */
    static get KNXDescriptionRequest() { return KNXDescriptionRequest;}

    /**
     *
     * @returns {KNXDescriptionResponse}
     * @constructor
     */
    static get KNXDescriptionResponse() { return KNXDescriptionResponse;}

    /**
     *
     * @returns {KNXConnectRequest}
     * @constructor
     */
    static get KNXConnectRequest() { return KNXConnectRequest;}

    /**
     *
     * @returns {KNXConnectResponse}
     * @constructor
     */
    static get KNXConnectResponse() { return KNXConnectResponse;}

    /**
     *
     * @returns {KNXConnectionStateRequest}
     * @constructor
     */
    static get KNXConnectionStateRequest() { return KNXConnectionStateRequest;}

    /**
     *
     * @returns {KNXConnectionStateResponse}
     * @constructor
     */
    static get KNXConnectionStateResponse() { return KNXConnectionStateResponse;}

    /**
     *
     * @returns {KNXDisconnectRequest}
     * @constructor
     */
    static get KNXDisconnectRequest() {return KNXDisconnectRequest;}

    /**
     *
     * @returns {KNXDisconnectResponse}
     * @constructor
     */
    static get KNXDisconnectResponse() {return KNXDisconnectResponse;}

    /**
     *
     * @returns {KNXTunnelingRequest}
     * @constructor
     */
    static get KNXTunnelingRequest() {return KNXTunnelingRequest;}

    /**
     *
     * @returns {KNXTunnelingAck}
     * @constructor
     */
    static get KNXTunnelingAck() {return KNXTunnelingAck;}

    /**
     *
     * @returns {KNXAddress}
     * @constructor
     */
    static get KNXAddress() {return KNXAddress;}

    /**
     *
     * @returns {HPAI}
     * @constructor
     */
    static get HPAI() { return HPAI;}

    /**
     *
     * @returns {CRI}
     * @constructor
     */
    static get CRI() { return CRI;}

    /**
     *
     * @returns {CRD}
     * @constructor
     */
    static get CRD() { return CRD;}

    /**
     *
     * @returns {DeviceInfo}
     * @constructor
     */
    static get DeviceInfo() { return DeviceInfo;}

    /**
     *
     * @returns {DIB}
     * @constructor
     */
    static get DIB() { return DIB;}

    /**
     *
     * @returns {IPCurrentConfig}
     * @constructor
     */
    static get IPCurrentConfig() { return IPCurrentConfig; }

    /**
     *
     * @returns {IPConfig}
     * @constructor
     */
    static get IPConfig() { return IPConfig; }

    /**
     *
     * @returns {TunnelCRI}
     * @constructor
     */
    static get TunnelCRI() { return TunnelCRI; }

    /**
     *
     * @returns {ServiceFamilies}
     * @constructor
     */
    static get ServiceFamilies() { return ServiceFamilies; }

    /**
     *
     * @returns {CEMIFactory}
     * @constructor
     */
    static get CEMIFactory() { return CEMIFactory; }

    /**
     *
     * @returns {LDataCon}
     * @constructor
     */
    static get LDataCon() { return LDataCon; }

    /**
     *
     * @returns {LDataReq}
     * @constructor
     */
    static get LDataReq() {return LDataReq; }

    /**
     *
     * @returns {LDataInd}
     * @constructor
     */
    static get LDataInd() {return LDataInd; }

    /**
     *
     * @param {Buffer} buffer
     * @returns {{knxHeader: KNXHeader, knxMessage: Buffer|KNXPacket}}
     */
    static parseMessage(buffer) {
        const knxHeader = KNXHeader.fromBuffer(buffer);
        const knxData = buffer.slice(knxHeader.headerLength);
        let knxMessage = knxData;
        switch(knxHeader.service_type) {
            case KNX_CONSTANTS.SEARCH_REQUEST:
                knxMessage = KNXSearchRequest.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.SEARCH_RESPONSE:
                knxMessage = KNXSearchResponse.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.DESCRIPTION_REQUEST:
                knxMessage = KNXDescriptionRequest.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.DESCRIPTION_RESPONSE:
                knxMessage = KNXDescriptionResponse.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.CONNECT_REQUEST:
                knxMessage - KNXDescriptionResponse.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.CONNECT_RESPONSE:
                knxMessage = KNXConnectResponse.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.CONNECTIONSTATE_REQUEST:
                knxMessage = KNXConnectionStateRequest.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE:
                knxMessage = KNXConnectionStateResponse.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.DISCONNECT_REQUEST:
                knxMessage = KNXDisconnectRequest.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.DISCONNECT_RESPONSE:
                knxMessage = KNXDisconnectResponse.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.TUNNELING_REQUEST:
                knxMessage = KNXTunnelingRequest.fromBuffer(knxData);
                break;
            case KNX_CONSTANTS.TUNNELING_ACK:
                knxMessage = KNXTunnelingAck.fromBuffer(buffer);
                break;
        }
        return {knxHeader, knxMessage};
    }

    /**
     *
     * @param {HPAI} hpai
     * @returns {KNXSearchRequest}
     */
    static newKNXSearchRequest(hpai) {
        return new KNXSearchRequest(hpai);
    }

    /**
     *
     * @param {HPAI} hpai
     * @returns {KNXDescriptionRequest}
     */
    static newKNXDescriptionRequest(hpai) {
        return new KNXDescriptionRequest(hpai);
    }

    /**
     *
     * @param {CRI} cri
     * @param {HPAI} hpaiControl=HPAI.NULLHPAI
     * @param {HPAI} hpaiData=HPAI.NULLHPAI
     * @returns {KNXConnectRequest}
     */
    static newKNXConnectRequest(cri, hpaiControl = HPAI.NULLHPAI, hpaiData = HPAI.NULLHPAI) {
        return new KNXConnectRequest(cri, hpaiControl, hpaiData);
    }

    /**
     *
     * @param {number} channelID
     * @param {HPAI} hpaiControl=HPAI.NULLHPAI
     * @returns {KNXConnectionStateRequest}
     */
    static newKNXConnectionStateRequest(channelID, hpaiControl = HPAI.NULLHPAI) {
        return new KNXConnectionStateRequest(channelID, hpaiControl);
    }

    /**
     *
     * @param {number} channelID
     * @param {HPAI} hpaiControl=HPAI.NULLHPAI
     * @returns {KNXConnectionStateRequest}
     */
    static newKNXDisconnectRequest(channelID, hpaiControl = HPAI.NULLHPAI) {
        return new KNXDisconnectRequest(channelID, hpaiControl);
    }

    /**
     *
     * @param {number} channelID
     * @param {number} status=KNX_CONSTANTS.E_NO_ERROR
     * @returns {KNXConnectionStateResponse}
     */
    static newKNXDisconnectResponse(channelID, status = KNX_CONSTANTS.E_NO_ERROR) {
        return new KNXDisconnectResponse(channelID, status);
    }

    /**
     *
     * @param {number} channelID
     * @param {number} seqCounter
     * @param {number} status
     * @returns {KNXTunnelingAck}
     */
    static newKNXTunnelingACK(channelID, seqCounter, status){
        return new KNXTunnelingAck(channelID, seqCounter, status)
    }

    /**
     *
     * @param {number} channelID
     * @param {number} seqCounter
     * @param {CEMIMessage} cEMIMessage
     * @returns {KNXTunnelingRequest}
     */
    static newKNXTunnelingRequest(channelID, seqCounter, cEMIMessage){
        return new KNXTunnelingRequest(channelID, seqCounter, cEMIMessage)
    }
}

module.exports = KNXProtocol;
