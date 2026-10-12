import { Expression } from "./Expression.ts";
import { ExpressionTuplePart } from "./ExpressionTuplePart.ts";
import { TokenTypeName } from "#tokeniser";
import { ExpressionTupleSpread } from "./ExpressionTupleSpread.ts";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionTuple extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^{$/gm,
      factory: (walker, lookFor, existing) => {
        const [{ value }, done] = walker
          .while(
            "value",
            (w) => (w.data === "{" || w.data === ",") && w.expect(["{", ","], TokenTypeName.Punctuation).data !== "}",
            (s) => {
              const next = s.expect(["{", ","], TokenTypeName.Punctuation);
              if (next.data === "...") {
                return ExpressionTupleSpread.Parse(next, [...lookFor, ",", "}"]);
              }

              return ExpressionTuplePart.Parse(next, [...lookFor, ",", "}"]);
            },
          )
          .if(
            (w) => w.data === "{",
            (w) => w.expect("{", TokenTypeName.Punctuation),
          )
          .if(
            (w) => w.data === ",",
            (w) => w.expect(",", TokenTypeName.Punctuation),
          )
          .expect("}", TokenTypeName.Punctuation)
          .finish();

        return new ExpressionTuple(_context(walker, done), value ?? []);
      },
    });
  }

  readonly #parts: Array<ExpressionTuplePart | ExpressionTupleSpread>;

  constructor(ctx: EntryContext, parts: Array<ExpressionTuplePart | ExpressionTupleSpread>) {
    super(ctx);
    this.#parts = parts;
  }

  get parts() {
    return this.#parts;
  }
}
