import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveDouble extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^double+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => {
        return new TypePrimitiveDouble(walker.location, walker.expect("double", TokenTypeName.Primitive), parent);
      },
    });
  }

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined) {
    super(location, done, parent);
  }

  get name() {
    return "double";
  }
}
