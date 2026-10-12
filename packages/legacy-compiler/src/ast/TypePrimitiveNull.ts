import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypePrimitiveNull } from "#linked/LinkedTypePrimitiveNull";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveNull extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^null+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, left?: Type) => {
        return new TypePrimitiveNull(_context(walker, walker.expect("null", TokenTypeName.KeyWord)));
      },
    });
  }

  get name() {
    return "null";
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    if (input && !(input instanceof LinkedTypePrimitiveNull)) {
      throw new LinkerError("Invalid type", input.range);
    }

    return ctx.finish(() => new LinkedTypePrimitiveNull(this.range));
  }
}
