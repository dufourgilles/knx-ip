"use strict";

const CONTROL_LENGTH = 2;

class ControlField {
    /**
     *
     * @param {number} control1
     * @param {number} control2
     */
    constructor(control1 = ControlField.DEFAULT_CONTROL1, control2=ControlField.DEFAULT_CONTROL2) {
        this.control1 = control1;
        this.control2 = control2;
        this.length = CONTROL_LENGTH;
    }

    /**
     *
     * @param {number} frameType
     */
    set frameType(frameType) {
        if (isNaN(frameType) || (frameType != 0 && frameType != 1)) {
            throw new Error("Invalid frame type");
        }
        this.control1 = (this.control1 & 0x7F) | (Number(frameType) << 7);
    }

    /**
     *
     * @returns {number}
     */
    get frameType() {
        return (this.control1 & 0x80) >> 7;
    }

    /**
     *
     * @param {number} repeat
     */
    set repeat(repeat) {
        if (isNaN(repeat) || (repeat != 0 && repeat != 1)) {
            throw new Error("Invalid repeat");
        }
        this.control1 = (this.control1 & 0xDF) | (Number(repeat) << 5);
    }

    /**
     *
     * @returns {number}
     */
    get repeat() {
        return (this.control1 & 0x20) >> 5;
    }

    /**
     *
     * @param {number} broadcast
     */
    set broadcast(broadcast) {
        if (isNaN(broadcast) || (broadcast != 0 && broadcast != 1)) {
            throw new Error("Invalid broadcast");
        }
        this.control1 =  (this.control1 & 0xEF) | (Number(broadcast) << 4);
    }

    /**
     *
     * @returns {number}
     */
    get broadcast() {
        return (this.control1 & 0x10) >> 4;
    }

    /**
     *
     * @param priority
     */
    set priority(priority) {
        if (isNaN(priority) || (priority < 0 && priority > 3)) {
            throw new Error("Invalid priority");
        }
        this.control1 = (this.control1 & 0xF3) | (Number(priority) << 2);
    }

    /**
     *
     * @returns {number}
     */
    get priority() {
        return (this.control1 & 0x0C) >> 2;
    }

    /**
     *
     * @param {number} ack
     */
    set ack(ack) {
        if (isNaN(ack) || (ack != 0 && ack != 1)) {
            throw new Error("Invalid ack");
        }
        this.control1 = (this.control1 & 0xFD) | (Number(ack) << 1);
    }

    /**
     *
     * @returns {boolean}
     */
    get ack() {
        return (this.control1 & 0x02) > 1;
    }

    /**
     *
     * @param {number} error
     */
    set error(error) {
        if (isNaN(error) || (error != 0 && error != 1)) {
            throw new Error("Invalid error");
        }
        this.control1 = (this.control1 & 0xFE) | Number(error);
    }

    /**
     *
     * @returns {number}
     */
    get error() {
        return this.control1 & 0x01;
    }

    /**
     *
     * @param type
     */
    set addressType(type) {
        if (isNaN(type) || (type != 0 && type != 1)) {
            throw new Error("Invalid address type");
        }
        this.control2 = (this.control2 & 0x7F) | (Number(type) << 7);
    }

    /**
     *
     * @returns {number}
     */
    get addressType() {
        return (this.control2 & 0x80) >> 7;
    }

    /**
     *
     * @param {number} hopCount
     */
    set hopCount(hopCount) {
        if (isNaN(hopCount) || (hopCount < 0 && hopCount > 7)) {
            throw new Error("Invalid hop count");
        }
        this.control2 = (this.control2 & 0x8F) | (Number(hopCount) << 4);
    }

    /**
     *
     * @returns {number}
     */
    get hopCount() {
        return (this.control2 & 0x70) >> 4;
    }

    /**
     *
     * @param {number} format
     */
    set frameFormat(format) {
        if (isNaN(format) || (format < 0 && format > 15)) {
            throw new Error("Invalid frame format");
        }
        this.control2 = (this.control2 & 0xF0) | Number(format);
    }

    /**
     *
     * @returns {number}
     */
    get framrFormat() {
        return this.control2 & 0xF;
    }

    /**
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        buffer.writeUInt8(this.control1, 0);
        buffer.writeUInt8(this.control2, 1);
        return buffer;
    }

    /**
     * Address Type Individual
     * @returns {number}
     * @constructor
     */
    static get TYPE_INDIVIDUAL() {
        return 0;
    }

    /**
     * Address Type Group
     * @returns {number}
     * @constructor
     */
    static get TYPE_GROUP() {
        return 1;
    }

    static get DEFAULT_CONTROL1() {
        return 0xBE;
    }

    static get DEFAULT_CONTROL2() {
        return 0xE0;
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset=0
     * @returns {ControlField}
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset + CONTROL_LENGTH >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const control1 = buffer.readUInt8(offset++);
        const control2 = buffer.readUInt8(offset);
        return new ControlField(control1, control2);
    }
}

module.exports = ControlField;
