import type ISerialiseable from "./base.ts";
import type { IBufferWriter, IBufferReader } from "./base.ts";

export class UShort implements ISerialiseable<number> {
  Impart(value: number, buffer: IBufferWriter): void {
    buffer.Write(16, value);
  }

  Accept(buffer: IBufferReader): number {
    return buffer.Read(16);
  }

  Confirm(value: unknown): value is number {
    return typeof value === "number";
  }
}
