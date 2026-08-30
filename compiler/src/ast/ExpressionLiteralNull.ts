import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";

export class ExpressionLiteralNull extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^null$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [, done] = walker.expect("null", TokenTypeName.KeyWord).finish();
    super(walker.location, done, parent);
  }

  get resolution() {
    return new TypePrimitiveUnknown(this.location, this.done, () => this);
  }

  get instruction(): Instruction {
    return { type: "literal_null" };
  }
}
