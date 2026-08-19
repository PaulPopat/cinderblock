import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveBool extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^bool+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, parent: Entry | undefined, left?: Type) => {
        return new TypePrimitiveBool(walker.location, walker.expect("bool").store, parent);
      },
    });
  }

  constructor(location: Location, done: TokenStore, parent: Entry | undefined) {
    super(location, done, parent);
  }

  get name() {
    return "bool";
  }
}
