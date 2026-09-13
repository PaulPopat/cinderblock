import type ISerialiseable from "./base.ts";
import type { IBufferWriter, IBufferReader } from "./base.ts";
import { BitMax } from "./utils.ts";

export class Enum<T extends string> implements ISerialiseable<T> {
  readonly #options: Array<T>;

  constructor(...options: Array<T>) {
    if (options.length > BitMax(8)) throw new Error("Too many options in the enum to fit in 8 bits");
    this.#options = options;
  }

  Impart(value: T, buffer: IBufferWriter): void {
    buffer.Write(8, this.#options.indexOf(value));
  }

  Accept(buffer: IBufferReader): T {
    const index = buffer.Read(8);
    return this.#options[index]!;
  }

  Confirm(value: unknown): value is T {
    return typeof value === "string" && this.#options.includes(value as T);
  }
}
