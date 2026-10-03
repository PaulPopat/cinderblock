import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Shape } from "#writer";
import type { Entry } from "./Entry.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";
import { TypeTuple } from "./TypeTuple.ts";

export class TypeIntersection extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\&$/gm,
      chainable: true,
      factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => {
        if (!left) throw new ParserError("Unexpected &", walker);
        const [{ right }, done] = walker
          .expect("&", TokenTypeName.Operator)
          .extract("right", (w) => Type.Parse(w, (): Entry => result))
          .finish();

        const result = new TypeIntersection(walker.location, done, parent, [
          ...(left instanceof TypeIntersection ? left.parts : [left]),
          ...(right instanceof TypeIntersection ? right.parts : [right]),
        ]);

        return result;
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

  flattened(): Type {
    return new TypeTuple(
      this.location,
      this.done,
      () => this.parent,
      this.#parts
        .map((p) => p.flattened())
        .flatMap((p) => {
          if (!(p instanceof TypeTuple)) {
            throw new LinkerError("Tuple required for intersection", this.range);
          }

          return p.args;
        }),
      [],
    );
  }

  matches(input: Type): boolean {
    throw new Error("Not implemented");
  }

  representation(depth: number): string {
    return this.#parts
      .map((p) => p.representation(depth + 1))
      .filter((value, index, total) => total.indexOf(value) === index)
      .join(" & ");
  }

  shape(): Shape {
    return {
      type: "tuple",
      args: this.#parts.flatMap((p) => {
        const pShape = p.shape();
        if (pShape.type !== "tuple") {
          throw new LinkerError("May only intersect on tuples", p.range);
        }

        return pShape.args;
      }),
    };
  }

  compatible(input: Type): boolean {
    return this.flattened().compatible(input);
  }

  dig(name: string): Entry | undefined {
    return this.#parts.find((p) => p.dig(name));
  }

  float(name: string): Entry | undefined {
    return this.dig(name) ?? this.parent?.float(name);
  }

  consolidate(input: Type, parent: () => Entry): Type {
    const result = new TypeTuple(
      this.location,
      this.done,
      parent,
      this.#parts
        .map((p) => p.flattened())
        .flatMap((p) => {
          if (!(p instanceof TypeTuple)) {
            throw new LinkerError("Tuple required for intersection", this.range);
          }

          return p.args;
        }),
      [],
    ).consolidate(input, (): Entry => result);

    return result;
  }
}
