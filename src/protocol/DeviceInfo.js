"use strict";
const DIB = require("./DIB");
const KNX_CONSTANTS = require("./KNXConstants");
const {splitIP, validateKNXAddress} = require("./KNXUtils");

const DEVICE_INFO_LENGTH = 0x36;
const SERIALNUMBER_LENGTH = 6;
const MACADDRESS_LENGTH = 6;
const NAME_LENGTH = 30;

const validArray = function(a, length) {
    if ((!Array.isArray(a)) || a.length !== length) {
        throw new Error("Invalid array format");
    }
    const validA = [0,0,0,0,0,0];
    for(let i = 0; i < a.length; i++) {
        validA[i] = Number(a[i]);
        if (isNaN(validA[i]) || validA[i] < 0 || validA[i] > 255) {
            throw new Error(`Invalid byte at pos ${i}`);
        }
    }
    return validA;
};

class DeviceInfo extends DIB {
    /**
     *
     * @param {number} medium
     * @param {number} status
     * @param {string|number} address - knx address
     * @param {number} projectID
     * @param {number[]} serialNumber
     * @param {string} ip
     * @param {number[]} macAddress
     * @param {string} name
     */
    constructor(medium, status, address, projectID, serialNumber, ip, macAddress, name) {
        super(KNX_CONSTANTS.DEVICE_INFO);
        this.medium = medium;
        this.status = status & 1;
        this.address = address;
        this.projectID = projectID;
        this.serialNumber = serialNumber;
        this.ip = ip;
        this.macAddress = macAddress;
        this.name = name;
    }

    /**
     *
     * @param {string} ip
     */
    set ip(ip) {
        this._splitIP = splitIP(ip);
    }

    get ip() {
        return this._splitIP.input;
    }

    /**
     *
     * @param {string} name
     */
    set name(name) {
        if (typeof(name) !== "string" || name.length > NAME_LENGTH) {
            throw new Error(`Invalid name format or too long - ${name}(${name.length}`);
        }
        this._name = name;
    }

    /**
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     *
     * @param {string|number} id
     */
    set projectID(id) {
        const _id = Number(id);
        if (isNaN(_id) || _id > 0xFFFF || _id < 0) {
            throw new Error("Invalid project id");
        }
        this._projectID = _id;
    }

    /**
     *
     * @returns {number}
     */
    get projectID() {
        return this._projectID;
    }
    /**
     *
     * @param {number[]}serialNumber
     */
    set serialNumber(serialNumber) {
        this._serialNumber = validArray(serialNumber, SERIALNUMBER_LENGTH);
    }

    /**
     *
     * @returns {number[]}
     */
    get serialNumber() {
        return this._serialNumber;
    }

    /**
     *
     * @param {number[]} macAddress
     */
    set macAddress(macAddress) {
        this._macAddress = validArray(macAddress, MACADDRESS_LENGTH);
    }

    /**
     *
     * @returns {number[]}
     */
    get macAddress() {
        return this._macAddress;
    }

    /**
     *
     * @param {string|number} medium
     */
    set medium(medium) {
        if (typeof(medium) === "string") {
            switch(medium) {
                case "TP1":
                    this._medium = KNX_CONSTANTS.TP1;
                    break;
                case "PL110":
                    this._medium = KNX_CONSTANTS.PL110;
                    break;
                case "RF":
                    this._medium = KNX_CONSTANTS.RF;
                    break;
                case "IP":
                    this._medium = KNX_CONSTANTS.IP;
                    break;
                default:
                    throw new Error(`Invalid medium ${medium}`);
            }
        }
        else {
            const _medium = Number(medium);
            if (_medium !== KNX_CONSTANTS.TP1 &&
                _medium !== KNX_CONSTANTS.PL110 &&
                _medium !== KNX_CONSTANTS.RF &&
                _medium !== KNX_CONSTANTS.IP) {
                throw new Error(`Unknown medium ${medium}`);
            }
            this._medium = _medium;
        }
    }

    /**
     *
     * @returns {number}
     */
    get medium() {
        return this._medium;
    }

    /**
     *
     * @returns {string}
     */
    get formattedMedium() {
        switch(this._medium) {
            case KNX_CONSTANTS.TP1:
                return "TP1";
            case KNX_CONSTANTS.PL110:
                return "PL110";
            case KNX_CONSTANTS.RF:
                return "RF";
            case KNX_CONSTANTS.IP:
                return "IP";
        }
    }

    /**
     *
     * @param {string|number} address
     */
    set address(address) {
        this._address = validateKNXAddress(address);
    }

    /**
     *
     * @returns {number}
     */
    get address() {
        return this._address;
    }

    /**
     *
     * @returns {string}
     */
    get formattedAddress() {
        let address = "";
        if (this._address > 0xFFF) {
            address = `${(this._address & 0xF000) >> 12}.`;
        }
        address += `${(this._address & 0x0F00) >> 8}.${this._address & 0xFF}`;
        return address;
    }

    /**
     *
     * @returns {number}
     */
    get length() {
        return DEVICE_INFO_LENGTH;
    }

    /**
     * @returns {Buffer}
     */
    toBuffer() {
        const buffer = Buffer.alloc(DEVICE_INFO_LENGTH);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(KNX_CONSTANTS.DEVICE_INFO, offset++);
        buffer.writeUInt8(this.medium, offset++);
        buffer.writeUInt8(this.status, offset++);
        buffer.writeUInt16BE(this.address, offset);
        offset += 2;
        buffer.writeUInt16BE(this.projectID, offset);
        offset += 2;
        for(let i = 0; i < this.serialNumber.length; i++) {
            buffer.writeUInt8(this.serialNumber[i], offset++);
        }
        for(let i = 1; i <= KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(this._splitIP[i], offset++);
        }
        for(let i = 0; i < this.macAddress.length; i++) {
            buffer.writeUInt8(this.macAddress[i], offset++);
        }
        for(let i = 0; i < NAME_LENGTH; i++) {
            buffer.writeUInt8(i >= this.name.length ? 0 : this.name[i], offset++);
        }
    }

    /**
     *
     * @param {Buffer} buffer
     * @param {number} offset
     */
    static fromBuffer(buffer, offset = 0) {
        if (offset + this.length >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error(`offset ${offset} block length: ${structureLength} out of buffer range ${buffer.length}`);
        }
        offset++;
        const type = buffer.readUInt8(offset++);
        if (type != KNX_CONSTANTS.DEVICE_INFO) {
            throw new Error(`Invalid DeviceInfo type ${type}`);
        }
        const medium = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset++);
        const address = buffer.readUInt16BE(offset);
        offset += 2;
        const projectID = buffer.readUInt16BE(offset);
        offset += 2;
        const serialNumber = [0,0,0,0,0,0];
        for(let i =0; i < SERIALNUMBER_LENGTH; i++) {
            serialNumber[i] = buffer.readUInt8(offset++);
        }
        const ip = [];
        for(let i = 1; i <= 4; i++) {
            ip.push(buffer.readUInt8(offset++));
        }
        const textIP = ip.join(".");
        const macAddress = [0,0,0,0,0,0];
        for(let i = 0; i < MACADDRESS_LENGTH; i++) {
            macAddress[i] = buffer.readUInt8(offset++);
        }
        let name = "";
        for(let i = 0; i < NAME_LENGTH; i++) {
            const char = buffer.readUInt8(offset++);
            if (char !== 0) {
                name += String.fromCharCode(char);
            }
            else {
                break;
            }
        }
        return new DeviceInfo(medium, status, address, projectID, serialNumber, textIP, macAddress, name);
    }
}

module.exports = DeviceInfo;
