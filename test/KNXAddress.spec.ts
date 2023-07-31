import { KNXAddress } from '../src/protocol/KNXAddress';
import { validateKNXAddress } from '../src/protocol/KNXUtils';

describe('KNXAddress', (): void => {
    it('should convert from string to Address', (): void => {
        const a = KNXAddress.createFromString('1.1.15');
        expect(a).toBeDefined();
        expect(a.toString()).toBe('1.1.15');
    });
    it('should convert from string to Address even group address', (): void => {
        const a = KNXAddress.createFromString('1.2.15', 1);
        expect(a).toBeDefined();
        expect(a.toString()).toBe('1/2/15');
    });
    test('valid group address in 2-level format', () => {
        expect(validateKNXAddress('31/2047', true)).toBe(0xFFFF);
    });

    test('valid group address in 3-level format', () => {
        expect(validateKNXAddress('31/7/255', true)).toBe(0xFFFF);
    });

    test('valid non-group address', () => {
        expect(validateKNXAddress('15.15.255', false)).toBe(0xFFFF);
    });

    test('invalid group address in 2-level format', () => {
        expect(() => validateKNXAddress('32/2047', true)).toThrowError('Invalid digit at pos 0 inside address: 32/2047');
        expect(() => validateKNXAddress('31/2048', true)).toThrowError('Invalid digit at pos 1 inside address: 31/2048');
    });

    test('invalid group address in 3-level format', () => {
        expect(() => validateKNXAddress('32/7/255', true)).toThrowError('Invalid digit at pos 0 inside address: 32/7/255');
        expect(() => validateKNXAddress('31/8/255', true)).toThrowError('Invalid digit at pos 1 inside address: 31/8/255');
        expect(() => validateKNXAddress('31/7/256', true)).toThrowError('Invalid digit at pos 2 inside address: 31/7/256');
    });

    test('invalid non-group address', () => {
        expect(() => validateKNXAddress('16.15.255', false)).toThrowError('Invalid digit at pos 0 inside address: 16.15.255');
        expect(() => validateKNXAddress('15.16.255', false)).toThrowError('Invalid digit at pos 1 inside address: 15.16.255');
        expect(() => validateKNXAddress('15.15.256', false)).toThrowError('Invalid digit at pos 2 inside address: 15.15.256');
    });

    test('valid numeric address', () => {
        expect(validateKNXAddress(0xFFFF)).toBe(0xFFFF);
    });

    test('invalid numeric address', () => {
        expect(() => validateKNXAddress(0x10000)).toThrowError('Invalid address 65536');
    });
});
