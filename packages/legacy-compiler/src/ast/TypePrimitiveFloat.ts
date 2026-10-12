import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypePrimitiveFloat } from "#linked/LinkedTypePrimitiveFloat";
import { LinkedTypePrimitiveMaths } from "#linked/LinkedTypePrimitiveMaths";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveFloat extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^float+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, left?: Type) => {
        return new TypePrimitiveFloat(_context(walker, walker.expect("float", TokenTypeName.KeyWord)));
      },
    });
  }

  get name() {
    return "float";
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    if (input && !(input instanceof LinkedTypePrimitiveMaths)) {
      throw new LinkerError("Invalid type", input.range);
    }

    return ctx.finish(() => new LinkedTypePrimitiveFloat(this.range));
  }
}
