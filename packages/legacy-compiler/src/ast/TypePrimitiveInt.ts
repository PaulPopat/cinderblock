import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypePrimitiveInt } from "#linked/LinkedTypePrimitiveInt";
import { LinkedTypePrimitiveMaths } from "#linked/LinkedTypePrimitiveMaths";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveInt extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^int+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, left?: Type) => {
        return new TypePrimitiveInt(_context(walker, walker.expect("int", TokenTypeName.KeyWord)));
      },
    });
  }

  get name() {
    return "int";
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    if (input && !(input instanceof LinkedTypePrimitiveMaths)) {
      throw new LinkerError("Invalid type", input.range);
    }

    return ctx.finish(() => new LinkedTypePrimitiveInt(this.range));
  }
}
