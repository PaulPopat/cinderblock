import { VariablePrimitiveBool, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { WriterError } from "./WriterError.ts";
import { TokenTypeName } from "#tokeniser";

export class ExpressionNot extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\!$/gm,
      inOne: false,
      factory: this,
    });
  }

  readonly #subject: Expression;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ subject }, done] = walker
      .expect("!", TokenTypeName.Operator)
      .extract("subject", (w) => Expression.ParseOne(w, () => this))
      .finish();
    super(walker.location, done, parent);
    this.#subject = subject;
  }

  get subject() {
    return this.#subject;
  }

  get resolution() {
    let subjectType = this.#subject.resolution;
    if (!(subjectType instanceof TypePrimitiveBool)) {
      throw new LinkerError("Boolean required", this.location);
    }

    return new TypePrimitiveBool(this.location, this.done, () => this);
  }

  async resolve(closure: Closure): Promise<Variable> {
    const subject = await this.#subject.resolve(closure);
    if (!(subject instanceof VariablePrimitiveBool)) {
      throw new WriterError("Subject not boolean", this.location);
    }

    return new VariablePrimitiveBool(!subject.value);
  }
}
