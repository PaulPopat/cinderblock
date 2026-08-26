import type { Closure, Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveChar } from "./TypePrimitiveChar.ts";
import { TokenTypeName } from "#tokeniser";

export class ExpressionLiteralChar extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^'([^']|\\.)'$/gm,
      factory: this,
    });
  }

  readonly #value: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker.text("value", TokenTypeName.String).finish();
    super(walker.location, done, parent);
    this.#value = value.slice(1, value.length - 1);
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypePrimitiveChar(this.location, this.done, () => this);
  }

  async resolve(closure: Closure): Promise<Variable> {
    throw new Error("Method not implemented.");
  }
}
