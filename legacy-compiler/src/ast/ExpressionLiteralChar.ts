import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveChar } from "./TypePrimitiveChar.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import type { Type } from "./Type.ts";
import type { TypeTuple } from "./TypeTuple.ts";

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

  resolution(invocationType: TypeTuple): Type {
    return new TypePrimitiveChar(this.location, this.done, () => this);
  }

  instruction(invocationType: TypeTuple): Instruction {
    const value: string = JSON.parse(`"${this.#value.slice(1, this.#value.length - 1)}"`);

    return { type: "literal_char", value: value.charCodeAt(0) };
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return [];
  }
}
