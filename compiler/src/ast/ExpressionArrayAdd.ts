import { VariableArray, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";

export class ExpressionArrayAdd extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\+\+$/gm,
      factory: this,
    });
  }

  readonly #subject: Expression;
  readonly #addition: Expression;

  constructor(walker: TokenWalker, parent: Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected ++", walker.store);
    const [{ addition }, done] = walker
      .expect("++")
      .extract("addition", (w) => Expression.Parse(w, this, lookFor))
      .finish();
    super(walker.location, done, parent);
    this.#subject = existing;
    this.#addition = addition;
  }

  get subject() {
    return this.#subject;
  }

  get addition() {
    return this.#addition;
  }

  get resolution() {
    return this.#subject.resolution;
  }

  async resolve(closure: Closure): Promise<Variable> {
    const left = await this.#subject.resolve(closure);
    const right = await this.#addition.resolve(closure);

    if (!(left instanceof VariableArray)) throw new Error("Invalid left");
    if (right instanceof VariableArray) {
      return new VariableArray([...left.data, ...right.data]);
    }

    return new VariableArray([...left.data, right]);
  }
}
