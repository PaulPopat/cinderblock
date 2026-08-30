import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import { EntityStruct } from "./EntityStruct.ts";
import type { Entry } from "./Entry.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";

export class TypeReference extends Type {
  static {
    Type.RegisterType({
      priority: 1,
      match: /^[a-zA-Z][a-zA-Z0-9_@$#:]*$/gm,
      chainable: false,
      factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => {
        const [{ value }, done] = walker.text("value", TokenTypeName.StructReference, (): TypeReference => result).finish();

        const result = new TypeReference(walker.location, done, parent, value);
        return result;
      },
    });
  }

  readonly #name: string;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, name: string) {
    super(location, done, parent);
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  get struct() {
    const result = this.float(this.#name);
    if (!(result instanceof EntityStruct)) throw new LinkerError("Reference not found", this.range);

    return result;
  }

  get args() {
    return this.struct.args;
  }
}
