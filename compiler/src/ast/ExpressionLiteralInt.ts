import { Closure, Variable, VariablePrimitiveInt } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { TypePrimitiveInt } from "./TypePrimitiveInt.ts";

export class ExpressionLiteralInt extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /[0-9]+i?$/gm,
      factory: this,
    });
  }

  readonly #value: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker.text("value").finish();
    super(walker.location, done, parent);
    this.#value = value.replace("i", "");
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypePrimitiveInt(this.location, this.done, () => this);
  }

  async resolve(closure: Closure): Promise<Variable> {
    return new VariablePrimitiveInt(Number.parseInt(this.#value));
  }
}
