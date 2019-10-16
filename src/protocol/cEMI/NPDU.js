"use strict";
const CEMIConstants = require("./CEMIConstants")
class NPDU {
    /**
     *
     * @param {number} tpci
     * @param {number} apci
     * @param {Buffer} data
     */
    constructor(tpci = 0x0, apci = 0x0, data = null) {
        /** @type {number} */
        this.tpci = tpci;
        /** @type {number} */
        this.apci = apci;
        /** @type {Buffer} */
        this.data = data
    }

    /**
     *
     * @param {string|number} tpci
     */
    set tpci(tpci) {
        if (isNaN(tpci) ||  (tpci < 0 && tpci > 0xFF)) {
            throw new Error("Invalid TPCI");
        }
        this._tpci = Number(tpci);
    }

    /**
     *
     * @returns {number}
     */
    get tpci() {
        return this._tpci;
    }

    /**
     *
     * @param {number} apci
     */
    set apci(apci) {
        if (isNaN(apci) || (apci < 0 && apci > 0xFF)) {
            throw new Error("Invalid APCI");
        }
        this._apci = Number(apci);
    }

    /**
     *
     * @returns {number}
     */
    get apci() {
        return this._apci;
    }

    /**
     *
     * @returns {Buffer}
     */
    get dataBuffer() {
        return this._data;
    }

    /**
     *
     * @returns {Buffer}
     */
    get dataValue() {
        if (this._data == null) {
            const val = this.apci & 0x3F;
            return Buffer.alloc(1, val);
        }
        return this._data;
    }

    /**
     *
     * @param {Buffer} data
     */
    set data(data) {
        if (data == null) {
            this._data = null;
            return;
        }
        if (!(data instanceof Buffer)) {
            throw new Error("Invalid data Buffer");
        }
        // if (data.length === 1 && data.readUInt8(0) < 0x3F) {
        //     this.apci = (this.apci & 0xC0) | data.readUInt8(0);
        //     this._data = null;
        //     return;
        // }
        this._data = data;
    }

    /**
     * NPDU Buffer length
     * @returns {*}
     */
    get length() {
        if (this._data === null) {
            return 3;
        }
        return 3 + this._data.length;
    }

    /**
     *
     * @returns {number}
     */
    get action() {
        return ((this.apci & 0xC0) >> 6) | ((this.tpci & 0x3) << 2);
    }

    /**
     *
     * @param {number} action
     */
    set action(action) {
        this.tpci = (action & 0xC) << 4;
        if (this.action === NPDU.GROUP_READ || this.action >= NPDU.INDIVIDUAL_WRITE) {
            this.apci = (action & 0x3) << 6;
        }
        else {
            this.apci = ((action & 0x3) << 6) | (this.apci & 0x3F);
        }
    }

    /**
     *
     * @returns {boolean}
     */
    get isGroupRead() {
        return this.action == NPDU.GROUP_READ;
    }

    /**
     *
     * @returns {boolean}
     */
    get isGroupWrite() {
        return this.action == NPDU.GROUP_WRITE;
    }

    /**
     *
     * @returns {boolean}
     */
    get isGroupResponse() {
        return this.action === NPDU.GROUP_RESPONSE;
    }


    /**
     * @returns {Buffer}
     */
    toBuffer() {
        const length = this._data == null ? 1 : this._data.length + 1;
        const buffer = Buffer.alloc(3);
        buffer.writeUInt8(length, 0);
        buffer.writeUInt8(this.tpci, 1);
        buffer.writeUInt8(this.apci, 2);
        if (length === 1) {
            return buffer;
        }
        return Buffer.concat([buffer, this._data]);
    }

    /**
     *
     * @param {Buffer} buffer
     * @parem {number} length
     * @param {number} offset=0
     * @returns {NPDU}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset > buffer.length) {
            throw new Error(`offset ${offset}  out of buffer range ${buffer.length}`);
        }
        const npduLength = buffer.readUInt8(offset++);
        const tpci = buffer.readUInt8(offset++);
        const apci = buffer.readUInt8(offset++);
        const data = npduLength > 1 ? buffer.slice(offset, offset + npduLength - 1) : null;
        return new NPDU(tpci, apci, data);
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get GROUP_READ() {
        return CEMIConstants.GROUP_READ;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get GROUP_RESPONSE() {
        return CEMIConstants.GROUP_RESPONSE;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get GROUP_WRITE() {
        return CEMIConstants.GROUP_WRITE;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get INDIVIDUAL_WRITE() {
        return CEMIConstants.INDIVIDUAL_WRITE;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get INDIVIDUAL_READ() {
        return CEMIConstants.INDIVIDUAL_READ;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get INDIVIDUAL_RESPONSE() {
        return CEMIConstants.INDIVIDUAL_RESPONSE;
    }

    static get TPCI_UNUMBERED_PACKET() {
        return CEMIConstants.TPCI_UNUMBERED_PACKET;
    }
}

module.exports = NPDU;
