import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveString } from "./TypePrimitiveString.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import type { Type } from "./Type.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export class ExpressionLiteralString extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^("([^"]|\\.)+"|"")$/gm,
      factory: this,
    });
  }

  readonly #value: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker.text("value", TokenTypeName.String).finish();
    super(walker.location, done, parent);
    this.#value = JSON.parse(value);
  }

  get value() {
    return this.#value;
  }

  resolution(invocationType: TypeTuple): Type {
    return new TypePrimitiveString(this.location, this.done, () => this);
  }

  instruction(invocationType: TypeTuple): Instruction {
    return { type: "literal_string", value: this.#value };
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return [];
  }
}
