import { TypeArg } from "./TypeArg.ts";
import { Expression } from "./Expression.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { ExpressionTuplePart } from "./ExpressionTuplePart.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";

export class ExpressionTuple extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^{$/gm,
      factory: this,
    });
  }

  readonly #parts: Array<ExpressionTuplePart>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker
      .while(
        "value",
        (w) => (w.data === "{" || w.data === ",") && w.expect(["{", ","], TokenTypeName.Punctuation).data !== "}",
        (s) => new ExpressionTuplePart(s.expect(["{", ","], TokenTypeName.Punctuation), () => this, [...lookFor, ",", "}"], undefined),
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

  partOf(name: string) {
    return this.#parts.find((p) => p.name === name);
  }

  get resolution() {
    return new TypeTuple(
      this.location,
      this.done,
      () => this,
      this.#parts.map((part) => new TypeArg(this.location, this.done, () => this, part.value.resolution, part.name)),
    );
  }

  get instruction(): Instruction {
    return {
      type: "tuple",
      parts: this.#parts.map((p) => [p.name, p.instruction]),
    };
  }
}
