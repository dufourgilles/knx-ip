import {KNXTunnelSocket} from '../src/KNXTunnelSocket';
import {KNXAddress, KNXAddressType} from '../src/protocol/KNXAddress';

// add firewall rule first to allow udp port 52345-52348
describe('bindSocketPort', (): void => {
    it('should able to bind on construction', async (): Promise<void> => {
         const a = new KNXTunnelSocket('3.3.3', 52345);
         expect(a).toBeDefined();
         await a.connectAsync('192.168.11.36', 3671);
         const dpa = KNXAddress.createFromString('1/0/0', KNXAddressType.TYPE_GROUP);
         const readResult = await a.readAsync(dpa);
         expect(readResult).toBeDefined();
         expect(readResult).toBeInstanceOf(Buffer);
    });
    it('should be able to bind with bindSocketPort', async (): Promise<void> => {
        const a = new KNXTunnelSocket('3.3.4');
        a.bindSocketPort(52346);
        expect(a).toBeDefined();
        await a.connectAsync('192.168.11.36', 3671);
        const dpa = KNXAddress.createFromString('1/0/0', KNXAddressType.TYPE_GROUP);
        const readResult = await a.readAsync(dpa);
        expect(readResult).toBeDefined();
        expect(readResult).toBeInstanceOf(Buffer);
    });
    it('should be fail to bind after connected', async (): Promise<void> => {
        const a = new KNXTunnelSocket('3.3.4');
        a.bindSocketPort(52347);
        expect(a).toBeDefined();
        await a.connectAsync('192.168.11.36', 3671);
        const dpa = KNXAddress.createFromString('1/0/0', KNXAddressType.TYPE_GROUP);
        const readResult = await a.readAsync(dpa);
        expect(readResult).toBeDefined();
        expect(readResult).toBeInstanceOf(Buffer);
        expect(a.bindSocketPort(52348)).rejects.toMatch('Socket already connected');
    });
});
