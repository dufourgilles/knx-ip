const KNXAddress = require("../src/protocol/KNXAddress");
describe("KNXAddress", function() {
    it("should convert from string to Address", function() {
         const a = new KNXAddress("1.1.15", );
         expect(a).toBeDefined();
         expect(a.toString()).toBe("1.1.15");
    });
    it("should convert from string to Address even group address", function() {
        const a = new KNXAddress("1.2.15", 1);
        expect(a).toBeDefined();
        expect(a.toString()).toBe("1.2.15");
    });
});