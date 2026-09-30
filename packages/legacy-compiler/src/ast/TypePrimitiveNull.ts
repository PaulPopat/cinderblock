import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Shape } from "#writer";
import type { Entry } from "./Entry.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveNull extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^null+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => {
        return new TypePrimitiveNull(walker.location, walker.expect("null", TokenTypeName.KeyWord), parent);
      },
    });
  }

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined) {
    super(location, done, parent);
  }

  get name() {
    return "null";
  }

  shape(): Shape {
    return { type: "null" };
  }

  compatible(input: Type): boolean {
    return input instanceof TypePrimitiveNull;
  }
}
