import {KNXAddress} from '../src/protocol/KNXAddress';
describe('KNXAddress', (): void => {
    it('should convert from string to Address', (): void => {
         const a = KNXAddress.createFromString('1.1.15' );
         expect(a).toBeDefined();
         expect(a.toString()).toBe('1.1.15');
    });
    it('should convert from string to Address even group address', (): void => {
        const a = KNXAddress.createFromString('1.2.15', 1);
        expect(a).toBeDefined();
        expect(a.toString()).toBe('1.2.15');
    });
});
