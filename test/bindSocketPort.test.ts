import {KNXTunnelSocket} from '../src/KNXTunnelSocket';
import {KNXAddress, KNXAddressType} from '../src/protocol/KNXAddress';
import { mocked } from 'ts-jest/utils';
import {KNXClient} from '../src/KNXClient';
jest.mock('../src/KNXClient', () => {
    const callbacks: {[x: string]: () => void} = {};
    const OriginalKNXClient = jest.requireActual('../src/KNXClient');
    let connected = false;
    const mockedSocket = {
        on: (event: string, cb: () => void) => {
            callbacks[event] = cb;
            return mockedSocket;
        },
        isConnected: () => connected,
        bindSocketPortAsync: () => Promise.resolve(),
        send: () => mockedSocket,
        disconnect: () => {
            connected = false;
            callbacks[KNXClient.KNXClientEvents.disconnected]();
        },
        startHeartBeat: () => mockedSocket,
        openTunnelConnection: () => {
            connected = true;
            callbacks[KNXClient.KNXClientEvents.connected]();
        }
    };
    const my_KNXClient = {
        KNXClient:  jest.fn().mockImplementation(() => mockedSocket)
    };
    (my_KNXClient.KNXClient as {[x: string]: any}).KNXClientEvents = OriginalKNXClient.KNXClient.KNXClientEvents;
    return my_KNXClient;
});

// add firewall rule first to allow udp port 52345-52348
describe('bindSocketPortAsync', (): void => {
    const MockedKNXClient = mocked(KNXClient, true);
    beforeEach(() => {
        MockedKNXClient.mockClear();
    });
    it('should be able to bind with bindSocketPort', async (): Promise<void> => {
        const a = new KNXTunnelSocket('3.3.4');
        a.bindSocketPortAsync(52346);
        expect(a).toBeDefined();
    });
    it('should fail to bind after connected', async (): Promise<void> => {
        const a = new KNXTunnelSocket('3.3.4');
        await a.bindSocketPortAsync(52347);
        expect(a).toBeDefined();
        let error = null;
        await a.connectAsync('192.168.11.36', 3671);
        try {
            a.bindSocketPortAsync();
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
    });
});
