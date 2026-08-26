import type { TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";

export class TypeUnion extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\|$/gm,
      chainable: true,
      factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => {
        if (!left) throw new ParserError("Unexpected |", walker);
        const [{ right }, done] = walker
          .expect("|")
          .extract("right", (w) => Type.Parse(w, parent))
          .finish();

        return new TypeUnion(walker.location, done, parent, [
          ...(left instanceof TypeUnion ? left.parts : [left]),
          ...(right instanceof TypeUnion ? right.parts : [right]),
        ]);
      },
    });
  }

  readonly #parts: Array<Type>;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, parts: Array<Type>) {
    super(location, done, parent);
    this.#parts = parts;
  }

  get parts() {
    return this.#parts;
  }
}
