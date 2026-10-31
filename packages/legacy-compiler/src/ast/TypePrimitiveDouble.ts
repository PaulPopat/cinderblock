import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypePrimitiveDouble } from "#linked/LinkedTypePrimitiveDouble";
import { LinkedTypePrimitiveMaths } from "#linked/LinkedTypePrimitiveMaths";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveDouble extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^double+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, namespace, left?: Type) => {
        return new TypePrimitiveDouble(_context(walker, walker.expect("double", TokenTypeName.KeyWord), namespace));
      },
    });
  }

  get name() {
    return "double";
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    if (input && !(input instanceof LinkedTypePrimitiveMaths)) {
      throw new LinkerError("Invalid type", input.range);
    }

    return ctx.finish(() => new LinkedTypePrimitiveDouble(this.range));
  }
}
