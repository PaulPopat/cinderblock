import { type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import type { TokenWalker } from "./TokenWalker.ts";

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
      .expect("(")
      .extract("subject", (w) => Expression.Parse(w, () => this, [...lookFor, ")"]))
      .expect(")")
      .finish();
    super(walker.location, done, parent);
    this.#subject = subject;
  }

  get subject() {
    return this.#subject;
  }

  get resolution() {
    return this.#subject.resolution;
  }

  resolve(closure: Closure): Promise<Variable> {
    return this.#subject.resolve(closure);
  }
}
