import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionLiteralArray } from "#linked/LinkedExpressionLiteralArray";
import { LinkedTypeUnion } from "#linked/LinkedTypeUnion";
import { LinkedTypePrimitiveUnknown } from "#linked/LinkedTypePrimitiveUnknown";

export class ExpressionLiteralArray extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^(\[)|(\[\])$/gm,
      factory: (walker, lookFor, existing) => {
        const [{ value }, done] = walker
          .if(
            (s) => s.data !== "[]",
            (w) =>
              w.while(
                "value",
                (w) => (w.data === "[" || w.data === ",") && w.expect(["[", ","], TokenTypeName.Punctuation).data !== "]",
                (s) => Expression.Parse(s.expect(["[", ","], TokenTypeName.Punctuation), [...lookFor, ",", "]"]),
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

        return new ExpressionLiteralArray(_context(walker, done), value ?? []);
      },
    });
  }

  readonly #value: Array<Expression>;

  constructor(ctx: EntryContext, value: Array<Expression>) {
    super(ctx);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx
      .mapWith(this.#value, "value", (c, i) => i.linked(left, c))
      .finish(
        ({ value }) =>
          new LinkedExpressionLiteralArray(
            this.range,
            value,
            value.length
              ? new LinkedTypeUnion(
                  this.range,
                  value.map((v) => v.resolution),
                )
              : new LinkedTypePrimitiveUnknown(this.range),
          ),
      );
  }
}
