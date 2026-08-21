import { VariablePrimitiveBool, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";

export class ExpressionLiteralBool extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^(true|false)$/gm,
      factory: this,
    });
  }

  readonly #value: boolean;

  constructor(walker: TokenWalker, parent: Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker.text("value").finish();
    super(walker.location, done, parent);
    this.#value = value === "true";
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypePrimitiveBool(this.location, this.done, this);
  }

  async resolve(closure: Closure): Promise<Variable> {
    return new VariablePrimitiveBool(this.#value);
  }
}
