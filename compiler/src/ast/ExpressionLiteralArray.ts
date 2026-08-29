import { VariableArray, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypeArray } from "./TypeArray.ts";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";

export class ExpressionLiteralArray extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^(\[)|(\[\])$/gm,
      factory: this,
    });
  }

  readonly #value: Array<Expression>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker
      .if(
        (s) => s.data !== "[]",
        (w) =>
          w.while(
            "value",
            (w) => (w.data === "[" || w.data === ",") && w.expect(["[", ","], TokenTypeName.Punctuation).data !== "]",
            (s) => Expression.Parse(s.expect(["[", ","], TokenTypeName.Punctuation), () => this, [...lookFor, ",", "]"]),
          ),
      )
      .if(
        (w) => w.data === "[",
        (w) => w.expect("[", TokenTypeName.Punctuation),
      )
      .if(
        (w) => w.data === ",",
        (w) => w.expect(",", TokenTypeName.Punctuation),
      )
      .if(
        (w) => w.data === "[]",
        (w) => w.expect("[]", TokenTypeName.Punctuation),
      )
      .if(
        (w) => w.data === "]",
        (w) => w.expect("]", TokenTypeName.Punctuation),
      )
      .finish();
    super(walker.location, done, parent);
    this.#value = value ?? [];
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypeArray(
      this.location,
      this.done,
      () => this,
      this.#value[0]?.resolution ?? new TypePrimitiveUnknown(this.location, this.done, () => this),
    );
  }

  async resolve(closure: Closure): Promise<Variable> {
    return new VariableArray(await Promise.all(this.#value.map((v) => v.resolve(closure))));
  }

  get instruction(): Instruction {
    return {
      type: "literal_array",
      subject: this.#value.map((v) => v.instruction),
    };
  }
}
