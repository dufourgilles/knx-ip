import { KNXAddress } from './protocol';

export interface KNXSocketOptions {
    srcAddress: KNXAddress;
    connectionKeepAliveTimeout: number;
}
