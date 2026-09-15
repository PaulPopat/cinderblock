import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";
import type { Type } from "./Type.ts";
import type { TypeTuple } from "./TypeTuple.ts";

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

  resolution(invocationType: TypeTuple): Type {
    return new TypePrimitiveUnknown(this.location, this.done, () => this);
  }

  instruction(invocationType: TypeTuple): Instruction {
    return { type: "literal_null" };
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return [];
  }
}
