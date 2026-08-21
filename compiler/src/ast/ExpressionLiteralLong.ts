import type { Closure, Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { TypePrimitiveLong } from "./TypePrimitiveLong.ts";

export class ExpressionLiteralLong extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^[0-9]+l$/gm,
      factory: this,
    });
  }

  readonly #value: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker.text("value").finish();
    super(walker.location, done, parent);
    this.#value = value.replace("l", "");
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypePrimitiveLong(this.location, this.done, () => this);
  }

  async resolve(closure: Closure): Promise<Variable> {
    throw new Error("Method not implemented.");
  }
}
