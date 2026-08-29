import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveFloat } from "./TypePrimitiveFloat.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";

export class ExpressionLiteralFloat extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /[0-9]+\.[0-9]+f?$/gm,
      factory: this,
    });
  }

  readonly #value: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker.text("value", TokenTypeName.Number).finish();
    super(walker.location, done, parent);
    this.#value = value.replace("f", "");
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypePrimitiveFloat(this.location, this.done, () => this);
  }

  get instruction(): Instruction {
    return { type: "literal_float", value: Number.parseFloat(this.#value) };
  }
}
