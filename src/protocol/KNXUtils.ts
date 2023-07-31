export const splitIP = (ip: string, name: string = 'ip'): RegExpMatchArray => {
    if (ip == null) {
        throw new Error(`${name} undefined`);
    }
    const m = ip.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
    if (m === null) {
        throw new Error(`Invalid ${name} format - ${ip}`);
    }
    return m;
};

export const validateKNXAddress = (address: string | number, isGroup: boolean = false): number => {
    if (typeof (address) === 'string') {
        const digits = address.split(/[./]/);
        if (digits.length < 2 || digits.length > 3) {
            throw new Error(`Invalid address format: ${address}`);
        }
        const bitSizes = (digits.length === 2) ? [5, 11] : isGroup ? [5, 3, 8] : [4, 4, 8];
        let newAddress = 0;
        for (let i = 0; i < digits.length; i++) {
            const digit = Number(digits[i]);
            if (isNaN(digit) || digit >= (1 << bitSizes[i])) {
                throw new Error(`Invalid digit at pos ${i} inside address: ${address}`);
            }
            newAddress = (newAddress << bitSizes[i]) | digit;
        }
        return newAddress;
    } else {
        const _address = Number(address);
        if (isNaN(_address) || _address < 0 || _address > 0xFFFF) {
            throw new Error(`Invalid address ${address}`);
        }
        return _address;
    }
};
