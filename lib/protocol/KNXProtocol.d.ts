/// <reference types="node" />
import { ConnectionStatus } from './KNXConstants';
import { KNXHeader } from './KNXHeader';
import { KNXSearchRequest } from './KNXSearchRequest';
import { KNXDescriptionRequest } from './KNXDescriptionRequest';
import { KNXConnectRequest } from './KNXConnectRequest';
import { KNXConnectionStateRequest } from './KNXConnectionStateRequest';
import { KNXDisconnectRequest } from './KNXDisconnectRequest';
import { KNXDisconnectResponse } from './KNXDisconnectResponse';
import { KNXTunnelingRequest } from './KNXTunnelingRequest';
import { KNXTunnelingAck } from './KNXTunnelingAck';
import { HPAI } from './HPAI';
import { CRI } from './CRI';
import { KNXPacket } from './KNXPacket';
import { CEMIMessage } from './cEMI/CEMIMessage';
export interface KNXProtocolInfo {
    knxHeader: KNXHeader;
    knxMessage: KNXPacket;
    knxData: Buffer;
}
export declare class KNXProtocol {
    static parseMessage(buffer: Buffer): KNXProtocolInfo;
    static newKNXSearchRequest(hpai: HPAI): KNXSearchRequest;
    static newKNXDescriptionRequest(hpai: HPAI): KNXDescriptionRequest;
    static newKNXConnectRequest(cri: CRI, hpaiControl?: HPAI, hpaiData?: HPAI): KNXConnectRequest;
    static newKNXConnectionStateRequest(channelID: number, hpaiControl?: HPAI): KNXConnectionStateRequest;
    static newKNXDisconnectRequest(channelID: number, hpaiControl?: HPAI): KNXDisconnectRequest;
    static newKNXDisconnectResponse(channelID: number, status: ConnectionStatus): KNXDisconnectResponse;
    static newKNXTunnelingACK(channelID: number, seqCounter: number, status: ConnectionStatus): KNXTunnelingAck;
    static newKNXTunnelingRequest(channelID: number, seqCounter: number, cEMIMessage: CEMIMessage): KNXTunnelingRequest;
}
