const ControlField = require("../src/protocol/cEMI/ControlField");

describe("ConfrolField" , function() {
    it("should have a rw hopCount property", function() {
        const control = new ControlField();
        expect(control.hopCount).toBe(6);
        expect(control.addressType).toBe(1);
        expect(control.control2).toBe(0xE0);
        control.addressType = 1;
        expect(control.control2).toBe(0xE0);
        control.hopCount = 6;
        expect(control.control2).toBe(0xE0);
        control.hopCount = 2;
        expect(control.control2).toBe(0xA0);
        control.addressType = 0;
        expect(control.control2).toBe(0x20);
    });
    it("should have a rw repeat property", function() {
        const control = new ControlField();
        expect(control.repeat).toBe(1);
        expect(control.control2).toBe(0xE0);
        control.repeat = 1;
        expect(control.control2).toBe(0xE0);
        control.repeat = 0;
        expect(control.control2).toBe(0xE0);
    });
});