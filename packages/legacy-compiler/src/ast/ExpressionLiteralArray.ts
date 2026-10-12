import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

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
}
