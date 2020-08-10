export declare const KNX_CONSTANTS: {
    KNXNETIP_VERSION_10: number;
    HEADER_SIZE_10: number;
    SEARCH_REQUEST: number;
    SEARCH_RESPONSE: number;
    DESCRIPTION_REQUEST: number;
    DESCRIPTION_RESPONSE: number;
    CONNECT_REQUEST: number;
    CONNECT_RESPONSE: number;
    CONNECTIONSTATE_REQUEST: number;
    CONNECTIONSTATE_RESPONSE: number;
    DISCONNECT_REQUEST: number;
    DISCONNECT_RESPONSE: number;
    DEVICE_CONFIGURATION_REQUEST: number;
    DEVICE_CONFIGURATION_ACK: number;
    TUNNELING_REQUEST: number;
    TUNNELING_ACK: number;
    ROUTING_INDICATION: number;
    ROUTING_LOST_MESSAGE: number;
    DEVICE_MGMT_CONNECTION: number;
    TUNNEL_CONNECTION: number;
    REMLOG_CONNECTION: number;
    REMCONF_CONNECTION: number;
    OBJSVR_CONNECTION: number;
    E_NO_ERROR: number;
    E_HOST_PROTOCOL_TYPE: number;
    E_VERSION_NOT_SUPPORTED: number;
    E_SEQUENCE_NUMBER: number;
    E_CONNECTION_ID: number;
    E_CONNECTION_TYPE: number;
    E_CONNECTION_OPTION: number;
    E_NO_MORE_CONNECTIONS: number;
    E_DATA_CONNECTION: number;
    E_KNX_CONNECTION: number;
    E_TUNNELING_LAYER: number;
    DEVICE_INFO: number;
    SUPP_SVC_FAMILIES: number;
    IP_CONFIG: number;
    IP_CUR_CONFIG: number;
    KNX_ADDRESSES: number;
    MFR_DATA: number;
    TP1: number;
    PL110: number;
    RF: number;
    IP: number;
    IPV4_UDP: number;
    IPV4_TCP: number;
    SEARCH_TIMEOUT: number;
    CONNECT_REQUEST_TIMEOUT: number;
    CONNECTIONSTATE_REQUEST_TIMEOUT: number;
    DEVICE_CONFIGURATION_REQUEST_TIMEOUT: number;
    TUNNELING_REQUEST_TIMEOUT: number;
    CONNECTION_ALIVE_TIME: number;
    TUNNEL_LINKLAYER: number;
    TUNNEL_RAW: number;
    TUNNEL_BUSMONITOR: number;
    KNX_PORT: number;
    KNX_IP: string;
    IPV4_ADDRESS_LENGTH: number;
};
export declare enum ConnectionStatus {
    E_CONNECTION_ID,
    E_NO_ERROR,
    E_DATA_CONNECTION,
    E_KNX_CONNECTION
}
