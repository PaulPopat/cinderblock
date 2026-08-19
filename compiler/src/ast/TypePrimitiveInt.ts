import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveInt extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^int+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, parent: Entry | undefined, left?: Type) => {
        return new TypePrimitiveInt(walker.location, walker.expect("int").store, parent);
      },
    });
  }

  constructor(location: Location, done: TokenStore, parent: Entry | undefined) {
    super(location, done, parent);
  }

  get name() {
    return "int";
  }
}
