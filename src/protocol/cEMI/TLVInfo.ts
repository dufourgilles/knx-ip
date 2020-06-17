'use strict';

export class TLVInfo {
    constructor(readonly type: number, readonly length: number, readonly info: Buffer) {
    }

    static createFromBuffer(buffer: Buffer, offset: number = 0): TLVInfo {
        const type = buffer.readUInt8(offset++);
        const length = buffer.readUInt8(offset++);
        const info = Buffer.alloc(length);
        for (let i = 0; i < length; i++) {
            info.writeUInt8(buffer.readUInt8(offset++), i);
        }
        return new TLVInfo(type, length, info);
    }

    toBuffer(): Buffer {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.type, 0);
        buffer.writeUInt8(this.length, 1);
        return Buffer.concat([buffer, this.info]);
    }
}
