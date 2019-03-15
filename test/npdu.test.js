const NPDU = require("../src/protocol/cEMI/NPDU");
describe("NPDU", function() {
    it("should have a constructor", function() {
        const n = new NPDU(0, 0x40, null);
        expect(n).toBeDefined();
        expect(n.action).toBe(1);
    });
});