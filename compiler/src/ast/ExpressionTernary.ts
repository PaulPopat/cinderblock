import { VariablePrimitiveBool, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { TypeUnion } from "./TypeUnion.ts";

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
    if (!existing) throw new ParserError("Unexpected ?", walker.store);
    const [{ positive, negative }, done] = walker
      .expect("?")
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

  get resolution() {
    return new TypeUnion(this.location, this.done, () => this, [this.#positive.resolution, this.#negative.resolution]);
  }

  async resolve(closure: Closure): Promise<Variable> {
    const predicate = await this.#predicate.resolve(closure);

    if (!(predicate instanceof VariablePrimitiveBool)) {
      throw new Error("Boolean required");
    }

    if (predicate.value) {
      return this.#positive.resolve(closure);
    }

    return this.#negative.resolve(closure);
  }
}
