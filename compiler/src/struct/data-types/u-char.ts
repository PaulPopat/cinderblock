import type ISerialiseable from "./base.ts";
import type { IBufferWriter, IBufferReader } from "./base.ts";

export class UChar implements ISerialiseable<number> {
  Impart(value: number, buffer: IBufferWriter): void {
    buffer.Write(8, value);
  }

  Accept(buffer: IBufferReader): number {
    return buffer.Read(8);
  }

  Confirm(value: unknown): value is number {
    return typeof value === "number";
  }
}
