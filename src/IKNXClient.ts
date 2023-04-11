import { KNXAddress, KNXDataBuffer, KNXPacket } from './protocol';
import { TunnelTypes } from './protocol/TunnelCRI';

export interface IKNXClient {
  bindSocketPortAsync: (port: number, host: string) => Promise<void>;
  send: (knxPacket: KNXPacket, host?: string, port?: number) => void;
  sendWriteRequest: (srcAddress: KNXAddress, dstAddress: KNXAddress, data: KNXDataBuffer, cb?: (e: Error) => void, host?: string, port?: number) => void;
  sendReadRequest: (srcAddress: KNXAddress, dstAddress: KNXAddress, cb?: (e: Error, d?: Buffer) => void, host?: string, port?: number) => void;
  startHeartBeat(): void;
  stopHeartBeat(): void;
  isDiscoveryRunning(): boolean;
  startDiscovery(): void;
  stopDiscovery(): void;
  getDescription(host: string, port: number): void;
  openTunnelConnection(host: string, port: number, knxLayer: TunnelTypes): void;
  getConnectionStatus(host: string, port: number, _channelID?: number): void;
  disconnect(host: string, port: number, channelID?: number): void;
  close(): void;
  isConnected(): boolean;

}
