import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypePrimitiveBool } from "#linked/LinkedTypePrimitiveBool";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveBool extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^bool+$/gm,
      chainable: false,
      factory: (walker: TokenWalker, namespace, left?: Type) => {
        return new TypePrimitiveBool(_context(walker, walker.expect("bool", TokenTypeName.KeyWord), namespace));
      },
    });
  }

  get name() {
    return "bool";
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    if (input && !(input instanceof LinkedTypePrimitiveBool)) {
      throw new LinkerError("Invalid type", input.range);
    }

    return ctx.finish(() => new LinkedTypePrimitiveBool(this.range));
  }
}
