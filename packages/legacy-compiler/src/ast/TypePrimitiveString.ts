import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypePrimitiveString } from "#linked/LinkedTypePrimitiveString";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveString extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^string+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, left?: Type) => {
        return new TypePrimitiveString(_context(walker, walker.expect("string", TokenTypeName.KeyWord)));
      },
    });
  }

  get name() {
    return "string";
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    if (input && !(input instanceof LinkedTypePrimitiveString)) {
      throw new LinkerError("Invalid type", input.range);
    }

    return ctx.finish(() => new LinkedTypePrimitiveString(this.range));
  }
}
