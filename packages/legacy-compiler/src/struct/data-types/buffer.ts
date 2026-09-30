import type ISerialiseable from "./base.ts";
import type { IBufferWriter, IBufferReader } from "./base.ts";

export class Buffer implements ISerialiseable<ArrayBuffer> {
  Impart(value: ArrayBuffer, buffer: IBufferWriter): void {
    buffer.Write(32, value.byteLength);
    for (const byte of new Uint8Array(value)) buffer.Write(8, byte);
  }

  Accept(buffer: IBufferReader): ArrayBuffer {
    const length = buffer.Read(32);
    const result: number[] = [];

    for (let i = 0; i < length; i++) result.push(buffer.Read(8));

    return new Uint8Array(result).buffer;
  }

  Confirm(value: unknown): value is ArrayBuffer {
    return ArrayBuffer.isView(value);
  }
}
