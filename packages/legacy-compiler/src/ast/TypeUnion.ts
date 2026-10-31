import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypeUnion } from "#linked/LinkedTypeUnion";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";

export class TypeUnion extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\|$/gm,
      chainable: true,
      factory: (walker: TokenWalker, namespace, left?: Type) => {
        if (!left) throw new ParserError("Unexpected |", walker);
        const [{ right }, done] = walker
          .expect("|", TokenTypeName.Operator)
          .extract("right", (w) => Type.Parse(w, namespace))
          .finish();

        const result = new TypeUnion(_context(walker, done, namespace), [
          ...(left instanceof TypeUnion ? left.parts : [left]),
          ...(right instanceof TypeUnion ? right.parts : [right]),
        ]);

        return result;
      },
    });
  }

  readonly #parts: Array<Type>;

  constructor(ctx: EntryContext, parts: Array<Type>) {
    super(ctx);
    this.#parts = parts;
  }

  get parts() {
    return this.#parts;
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    if (!input) {
      return ctx
        .mapWith(this.#parts, "parts", (c, i) => i.linked(undefined, c))
        .finish(({ parts }) => {
          return new LinkedTypeUnion(this.range, parts);
        });
    }

    if (input instanceof LinkedTypeUnion) {
      // This allows any union to replace another. Not safe and should be changed.
      return [ctx, input];
    }

    for (const part of this.#parts) {
      try {
        return ctx.with("part", (c) => part.linked(input, c)).finish(({ part }) => part);
      } catch {}
    }

    throw new LinkerError("Input did not match any possible union types", input.range);
  }
}
