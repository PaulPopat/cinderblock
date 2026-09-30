import type ISerialiseable from "./base.ts";
import type { IBufferWriter, IBufferReader } from "./base.ts";

export class Empty implements ISerialiseable<never> {
  Impart(_1: never, _2: IBufferWriter): void {}

  Accept(_: IBufferReader): never {
    return undefined as never;
  }

  Confirm(_: unknown): _ is never {
    return true;
  }
}
