import type { EntryContext } from "./EntryContext.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";

export class TypeIntersection extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\&$/gm,
      parse: (w, left) => {
        if (!left) throw new ParserError("Unexpected &", w.store);
        return w
          .expect("&")
          .extract("right", (w) => Type.Parse(w, "&"))
          .finish(
            ({ right }, ctx) =>
              new TypeIntersection(ctx, [
                ...(left instanceof TypeIntersection ? left.parts : [left]),
                right,
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
