import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypePrimitiveLong } from "#linked/LinkedTypePrimitiveLong";
import { LinkedTypePrimitiveMaths } from "#linked/LinkedTypePrimitiveMaths";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveLong extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^long+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, namespace, left?: Type) => {
        return new TypePrimitiveLong(_context(walker, walker.expect("long", TokenTypeName.KeyWord), namespace));
      },
    });
  }

  get name() {
    return "long";
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    if (input && !(input instanceof LinkedTypePrimitiveMaths)) {
      throw new LinkerError("Invalid type", input.range);
    }

    return ctx.finish(() => new LinkedTypePrimitiveLong(this.range));
  }
}
