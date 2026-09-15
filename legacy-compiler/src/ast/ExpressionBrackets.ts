import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc } from "#writer";
import type { Type } from "./Type.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export class ExpressionBrackets extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\($/gm,
      factory: this,
    });
  }

  readonly #subject: Expression;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ subject }, done] = walker
      .expect("(", TokenTypeName.Operator)
      .extract("subject", (w) => Expression.Parse(w, () => this, [...lookFor, ")"]))
      .expect(")", TokenTypeName.Operator)
      .finish();
    super(walker.location, done, parent);
    this.#subject = subject;
  }

  get subject() {
    return this.#subject;
  }

  resolution(invocationType: TypeTuple): Type {
    return this.#subject.resolution(invocationType);
  }

  instruction(invocationType: TypeTuple) {
    return this.#subject.instruction(invocationType);
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return [...this.#subject.funcs(invocationType)];
  }
}
