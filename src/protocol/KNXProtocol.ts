'use strict';
import {KNX_CONSTANTS, ConnectionStatus} from './KNXConstants';
import {KNXHeader} from './KNXHeader';
import {KNXSearchRequest} from './KNXSearchRequest';
import {KNXSearchResponse} from './KNXSearchResponse';
import {KNXDescriptionRequest} from './KNXDescriptionRequest';
import {KNXDescriptionResponse} from './KNXDescriptionResponse';
import {KNXConnectRequest} from './KNXConnectRequest';
import {KNXConnectResponse} from './KNXConnectResponse';
import {KNXConnectionStateRequest} from './KNXConnectionStateRequest';
import {KNXConnectionStateResponse} from './KNXConnectionStateResponse';
import {KNXDisconnectRequest} from './KNXDisconnectRequest';
import {KNXDisconnectResponse} from './KNXDisconnectResponse';
import {KNXTunnelingRequest} from './KNXTunnelingRequest';
import {KNXTunnelingAck} from './KNXTunnelingAck';
import {HPAI} from './HPAI';
import {CRI} from './CRI';
import {KNXPacket} from './KNXPacket';
import {CEMIMessage} from './cEMI/CEMIMessage';

export interface KNXProtocolInfo {
    knxHeader: KNXHeader;
    knxMessage: KNXPacket;
    knxData: Buffer;
}

/**
 * KNX Protocol Elements
 */
export class KNXProtocol {
    /**
     *
     * @param {Buffer} buffer
     * @returns {{knxHeader: KNXHeader, knxMessage: Buffer|KNXPacket}}
     */
    static parseMessage(buffer: Buffer): KNXProtocolInfo {
        const knxHeader = KNXHeader.createFromBuffer(buffer);
        const knxData = buffer.slice(knxHeader.headerLength);
        let knxMessage: KNXPacket;
        switch (knxHeader.service_type) {
            case KNX_CONSTANTS.SEARCH_REQUEST:
                knxMessage = KNXSearchRequest.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.SEARCH_RESPONSE:
                knxMessage = KNXSearchResponse.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.DESCRIPTION_REQUEST:
                knxMessage = KNXDescriptionRequest.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.DESCRIPTION_RESPONSE:
                knxMessage = KNXDescriptionResponse.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.CONNECT_REQUEST:
                knxMessage = KNXDescriptionResponse.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.CONNECT_RESPONSE:
                knxMessage = KNXConnectResponse.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.CONNECTIONSTATE_REQUEST:
                knxMessage = KNXConnectionStateRequest.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE:
                knxMessage = KNXConnectionStateResponse.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.DISCONNECT_REQUEST:
                knxMessage = KNXDisconnectRequest.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.DISCONNECT_RESPONSE:
                knxMessage = KNXDisconnectResponse.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.TUNNELING_REQUEST:
                knxMessage = KNXTunnelingRequest.createFromBuffer(knxData);
                break;
            case KNX_CONSTANTS.TUNNELING_ACK:
                knxMessage = KNXTunnelingAck.createFromBuffer(knxData);
                break;
        }
        return {knxHeader, knxMessage, knxData};
    }

    static newKNXSearchRequest(hpai: HPAI): KNXSearchRequest {
        return new KNXSearchRequest(hpai);
    }

    static newKNXDescriptionRequest(hpai: HPAI): KNXDescriptionRequest {
        return new KNXDescriptionRequest(hpai);
    }

    static newKNXConnectRequest(cri: CRI, hpaiControl: HPAI = HPAI.NULLHPAI, hpaiData: HPAI = HPAI.NULLHPAI): KNXConnectRequest {
        return new KNXConnectRequest(cri, hpaiControl, hpaiData);
    }

    static newKNXConnectionStateRequest(channelID: number, hpaiControl: HPAI = HPAI.NULLHPAI): KNXConnectionStateRequest {
        return new KNXConnectionStateRequest(channelID, hpaiControl);
    }

    static newKNXDisconnectRequest(channelID: number, hpaiControl: HPAI = HPAI.NULLHPAI): KNXDisconnectRequest {
        return new KNXDisconnectRequest(channelID, hpaiControl);
    }

    static newKNXDisconnectResponse(channelID: number, status: ConnectionStatus): KNXDisconnectResponse {
        return new KNXDisconnectResponse(channelID, status);
    }

    static newKNXTunnelingACK(channelID: number, seqCounter: number, status: ConnectionStatus): KNXTunnelingAck {
        return new KNXTunnelingAck(channelID, seqCounter, status);
    }

    static newKNXTunnelingRequest(channelID: number, seqCounter: number, cEMIMessage: CEMIMessage): KNXTunnelingRequest {
        return new KNXTunnelingRequest(channelID, seqCounter, cEMIMessage);
    }
}
