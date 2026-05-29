import type { Location } from "#utils";
import type { EntryContext } from "./EntryContext.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";

export class TypeUnion extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\|$/gm,
      chainable: true,
      parse: (w, left) => {
        if (!left) throw new ParserError("Unexpected |", w.store);
        return w
          .expect("|")
          .extract("right", (w) => Type.Parse(w))
          .finish(
            ({ right }, ctx) =>
              new TypeUnion(ctx, [
                ...(left instanceof TypeUnion ? left.parts : [left]),
                ...(right instanceof TypeUnion ? right.parts : [right]),
              ]),
          );
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
}
