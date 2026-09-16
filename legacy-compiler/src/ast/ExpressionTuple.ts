import { TypeArg } from "./TypeArg.ts";
import { Expression } from "./Expression.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { ExpressionTuplePart } from "./ExpressionTuplePart.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import { ExpressionTupleSpread } from "./ExpressionTupleSpread.ts";
import { LinkerError } from "./LinkerError.ts";
import { TypeReference } from "./TypeReference.ts";
import type { Type } from "./Type.ts";

export class ExpressionTuple extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^{$/gm,
      factory: this,
    });
  }

  readonly #parts: Array<ExpressionTuplePart | ExpressionTupleSpread>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker
      .while(
        "value",
        (w) => (w.data === "{" || w.data === ",") && w.expect(["{", ","], TokenTypeName.Punctuation).data !== "}",
        (s) => {
          const next = s.expect(["{", ","], TokenTypeName.Punctuation);
          if (next.data === "...") {
            return new ExpressionTupleSpread(next, () => this, [...lookFor, ",", "}"], undefined);
          }

          return new ExpressionTuplePart(next, () => this, [...lookFor, ",", "}"], undefined);
        },
      )
      .if(
        (w) => w.data === "{",
        (w) => w.expect("{", TokenTypeName.Punctuation),
      )
      .if(
        (w) => w.data === ",",
        (w) => w.expect(",", TokenTypeName.Punctuation),
      )
      .expect("}", TokenTypeName.Punctuation)
      .finish();
    super(walker.location, done, parent);
    this.#parts = value ?? [];
  }

  get parts() {
    return this.#parts;
  }

  get resolution(): Type {
    return new TypeTuple(
      this.location,
      this.done,
      () => this,
      this.#parts.flatMap((part) => {
        if (part instanceof ExpressionTupleSpread) {
          const resolution = part.resolution;
          if (resolution instanceof TypeTuple || resolution instanceof TypeReference) {
            return resolution.args;
          }

          throw new LinkerError("Expected a tuple", this.range);
        }

        return [new TypeArg(this.location, this.done, () => this, part.value.resolution, part.name)];
      }),
    ).flattened;
  }

  get instruction(): Instruction {
    return {
      type: "tuple",
      parts: this.#parts.flatMap((part) => {
        if (part instanceof ExpressionTupleSpread) {
          const resolution = part.resolution;
          if (resolution instanceof TypeTuple || resolution instanceof TypeReference) {
            return resolution.args.map((a): [string, Instruction] => [a.name, { type: "access", subject: part.instruction, key: a.name }]);
          }

          throw new LinkerError("Expected a tuple", this.range);
        }

        return [[part.name, part.instruction]];
      }),
    };
  }

  get funcs(): Array<CreateFunc> {
    return this.#parts.flatMap((p) => p.funcs);
  }
}
