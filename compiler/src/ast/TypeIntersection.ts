import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { Type } from "./Type.ts";

export class TypeIntersection extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\&$/gm,
      chainable: true,
      factory: (walker: TokenWalker, parent: Entry | undefined, left?: Type) => {
        if (!left) throw new ParserError("Unexpected &", walker.store);
        const [{ right }, done] = walker
          .expect("&")
          .extract("right", (w) => Type.Parse(w, parent))
          .finish();

        return new TypeIntersection(walker.location, done, parent, [
          ...(left instanceof TypeIntersection ? left.parts : [left]),
          ...(right instanceof TypeIntersection ? right.parts : [right]),
        ]);
      },
    });
  }

  readonly #parts: Array<Type>;

  constructor(location: Location, done: TokenStore, parent: Entry | undefined, parts: Array<Type>) {
    super(location, done, parent);
    this.#parts = parts;
  }

  get parts() {
    return this.#parts;
  }
}
