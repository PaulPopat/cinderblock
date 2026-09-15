import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypeUnion } from "./TypeUnion.ts";
import { WriterError } from "./WriterError.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import type { Type } from "./Type.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export class ExpressionTernary extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^\?$/gm,
      factory: this,
    });
  }

  readonly #predicate: Expression;
  readonly #positive: Expression;
  readonly #negative: Expression;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected ?", walker);
    const [{ positive, negative }, done] = walker
      .expect("?", TokenTypeName.Operator)
      .extract("positive", (w) => Expression.Parse(w, () => this, [":"]))
      .extract("negative", (w) => Expression.Parse(w, () => this, lookFor))
      .finish();
    super(walker.location, done, parent);
    this.#predicate = existing;
    this.#positive = positive;
    this.#negative = negative;
  }

  get predicate() {
    return this.#predicate;
  }

  get positive() {
    return this.#positive;
  }

  get negative() {
    return this.#negative;
  }

  resolution(invocationType: TypeTuple): Type {
    return new TypeUnion(this.location, this.done, () => this, [
      this.#positive.resolution(invocationType),
      this.#negative.resolution(invocationType),
    ]);
  }

  instruction(invocationType: TypeTuple): Instruction {
    if (!(this.#predicate.resolution(invocationType) instanceof TypePrimitiveBool)) {
      throw new WriterError("Boolean required", this.range);
    }

    return {
      type: "ternary",
      predicate: this.#predicate.instruction(invocationType),
      positive: this.#positive.instruction(invocationType),
      negative: this.#negative.instruction(invocationType),
    };
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return [...this.#predicate.funcs(invocationType), ...this.#positive.funcs(invocationType), ...this.#negative.funcs(invocationType)];
  }
}
