import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypePrimitiveUnknown } from "#linked/LinkedTypePrimitiveUnknown";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveUnknown extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^unknown+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, left?: Type) => {
        return new TypePrimitiveUnknown(_context(walker, walker.expect("unknown", TokenTypeName.KeyWord)));
      },
    });
  }

  get name() {
    return "unknown";
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    return ctx.finish(() => input ?? new LinkedTypePrimitiveUnknown(this.range));
  }
}
