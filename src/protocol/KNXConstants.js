const KNX_CONSTANTS = {
    KNXNETIP_VERSION_10: 0x10,
    HEADER_SIZE_10: 0x6,
    SEARCH_REQUEST: 0x0201,  //Sent by KNXnet/IP Client to search available KNXnet/IP Servers.
    SEARCH_RESPONSE: 0x0202, //Sent by KNXnet/IP Server when receiving a KNXnet/IP SEARCH_REQUEST.
    DESCRIPTION_REQUEST: 0x203, //Sent by KNXnet/IP Client to a KNXnet/IP Server to retrieve information about capabilities and supported services
    DESCRIPTION_RESPONSE: 0x0204, //Sent by KNXnet/IP Server in response to a DESCRIPTION_REQUEST to provide information about the server implementation.
    CONNECT_REQUEST: 0x0205, // Sent by KNXnet/IP Client for establishing a communication channel to a KNXnet/IP Server.
    CONNECT_RESPONSE: 0x0206, // Sent by KNXnet/IP Server as answer toCONNECT_REQUEST telegram.
    CONNECTIONSTATE_REQUEST: 0x0207, // Sent by KNXnet/IP Client for requesting the connection state of an established connection to a KNXnet/IP Server.
    CONNECTIONSTATE_RESPONSE: 0x0208, //Sent by KNXnet/IP Server when receiving a CONNECTIONSTATE_REQUEST for an established connection.
    DISCONNECT_REQUEST: 0x0209, // Sent by KNXnet/IP device, typically the KNXnet/IP Client, to terminate an established connection.
    DISCONNECT_RESPONSE: 0x020A, // Sent by KNXnet/IP device, typically the KNXnet/IP Server, in response to a DISCONNECT_REQUEST.
    DEVICE_CONFIGURATION_REQUEST: 0x0310, //Reads/Writes KNXnet/IP device configuration data (Interface Object Properties)
    DEVICE_CONFIGURATION_ACK: 0x0311, // Sent by a KNXnet/IP device to confirm the reception of the DEVICE_CONFIGURATION_REQUEST
    TUNNELING_REQUEST: 0x0420, // Used for sending and receiving single KNX telegrams between KNXnet/IP Client and - Server
    TUNNELING_ACK: 0x0421, // Sent by a KNXnet/IP device to confirm the reception of the TUNNELING_REQUEST
    ROUTING_INDICATION: 0x0530, // Used for sending KNX telegrams over IP networks. This service is unconfirmed.
    ROUTING_LOST_MESSAGE: 0x0531, // Used for indication of lost KNXnet/IP Routing messages. This service is unconfirmed
    // Connection Types
    DEVICE_MGMT_CONNECTION: 0x03, // Data connection used to configure a KNXnet/IP device
    TUNNEL_CONNECTION: 0x04, // Data connection used to forward KNX telegrams between two KNXnet/IP devices
    REMLOG_CONNECTION: 0x06, // Data connection used for configuration and data transfer with a remote logging server
    REMCONF_CONNECTION: 0x07, //Data connection used for data transfer with a remote configuration server.
    OBJSVR_CONNECTION: 0x08, // Data connection used for configuration and data transfer with an Object Server in a KNXnet/IP device.
    // Error Codes
    E_NO_ERROR: 0x00,
    E_HOST_PROTOCOL_TYPE: 0x01,
    E_VERSION_NOT_SUPPORTED: 0x02,
    E_SEQUENCE_NUMBER: 0x04,
    E_CONNECTION_ID: 0x21,
    E_CONNECTION_TYPE: 0x22,
    E_CONNECTION_OPTION: 0x23,
    E_NO_MORE_CONNECTIONS: 0x24,
    E_DATA_CONNECTION: 0x26,
    E_KNX_CONNECTION: 0x27,
    E_TUNNELING_LAYER: 0x29,
    // Description Information Blcok (DIB)
    DEVICE_INFO: 0x01,
    SUPP_SVC_FAMILIES: 0x02,
    IP_CONFIG: 0x03,
    IP_CUR_CONFIG: 0x04,
    KNX_ADDRESSES: 0x05,
    MFR_DATA: 0xFE,
    // medium code
    TP1: 0x02,
    PL110: 0x04,
    RF: 0x10,
    IP: 0x20,
    // Host protocol codes
    IPV4_UDP: 0x01,
    IPV4_TCP: 0x02,
    // Timeout constants
    SEARCH_TIMEOUT: 10,
    CONNECT_REQUEST_TIMEOUT: 10,
    CONNECTIONSTATE_REQUEST_TIMEOUT: 10,
    DEVICE_CONFIGURATION_REQUEST_TIMEOUT: 10,
    TUNNELING_REQUEST_TIMEOUT: 1,
    CONNECTION_ALIVE_TIME: 120,
    //CRI
    TUNNEL_LINKLAYER: 0x02,
    TUNNEL_RAW: 0x04,
    TUNNEL_BUSMONITOR: 0x80,
    // Internet Protocol constants
    KNX_PORT: 3671,
    KNX_IP: "224.0.23.12",
    // Generic
    IPV4_ADDRESS_LENGTH: 4
};

module.exports = KNX_CONSTANTS;