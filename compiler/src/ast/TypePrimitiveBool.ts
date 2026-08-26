import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveBool extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^bool+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => {
        return new TypePrimitiveBool(walker.location, walker.expect("bool", TokenTypeName.Primitive), parent);
      },
    });
  }

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined) {
    super(location, done, parent);
  }

  get name() {
    return "bool";
  }
}
