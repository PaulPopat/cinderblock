import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypePrimitiveChar } from "#linked/LinkedTypePrimitiveChar";
import { LinkedTypePrimitiveMaths } from "#linked/LinkedTypePrimitiveMaths";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveChar extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^char+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, left?: Type) => {
        return new TypePrimitiveChar(_context(walker, walker.expect("char", TokenTypeName.KeyWord)));
      },
    });
  }

  get name() {
    return "char";
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    if (input && !(input instanceof LinkedTypePrimitiveMaths)) {
      throw new LinkerError("Invalid type", input.range);
    }

    return ctx.finish(() => new LinkedTypePrimitiveChar(this.range));
  }
}
