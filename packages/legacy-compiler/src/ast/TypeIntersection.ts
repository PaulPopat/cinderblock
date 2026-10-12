import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypeTuple } from "#linked/LinkedTypeTuple";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";

export class TypeIntersection extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\&$/gm,
      chainable: true,
      factory: (walker: TokenWalker, left?: Type) => {
        if (!left) throw new ParserError("Unexpected &", walker);
        const [{ right }, done] = walker
          .expect("&", TokenTypeName.Operator)
          .extract("right", (w) => Type.Parse(w))
          .finish();

        const result = new TypeIntersection(_context(walker, done), [
          ...(left instanceof TypeIntersection ? left.parts : [left]),
          ...(right instanceof TypeIntersection ? right.parts : [right]),
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

  linked(input: LinkedType | undefined, ctx: LinkerContext) {
    if (input && !(input instanceof LinkedTypeTuple)) {
      throw new LinkerError("Invalid type", input?.range ?? this.range);
    }

    return ctx
      .mapWith(this.#parts, "parts", (c, part) => part.linked(input, c))
      .finish(
        ({ parts }) =>
          new LinkedTypeTuple(
            this.range,
            parts.flatMap((part) => {
              if (!(part instanceof LinkedTypeTuple)) {
                throw new LinkerError("Intersection parts must be Tuples", input?.range ?? this.range);
              }

              return part.args;
            }),
          ),
      );
  }
}
