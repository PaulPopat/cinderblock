import { Closure, Variable, VariablePrimitiveString } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { TypePrimitiveString } from "./TypePrimitiveString.ts";

export class ExpressionLiteralString extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^"([^"]|\\.)+"$/gm,
      factory: this,
    });
  }

  readonly #value: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker.text("value").finish();
    super(walker.location, done, parent);
    this.#value = value.slice(1, value.length - 1);
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypePrimitiveString(this.location, this.done, () => this);
  }

  async resolve(closure: Closure): Promise<Variable> {
    return new VariablePrimitiveString(this.#value);
  }
}
