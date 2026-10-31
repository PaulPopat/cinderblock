import { Expression } from "./Expression.ts";
import { ExpressionTuplePart } from "./ExpressionTuplePart.ts";
import { TokenTypeName } from "#tokeniser";
import { ExpressionTupleSpread } from "./ExpressionTupleSpread.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionTuple } from "#linked/LinkedExpressionTuple";
import { LinkerError } from "./LinkerError.ts";

export class ExpressionTuple extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^{$/gm,
      factory: (walker, namespace, lookFor, existing) => {
        const [{ value }, done] = walker
          .while(
            "value",
            (w) => (w.data === "{" || w.data === ",") && w.expect(["{", ","], TokenTypeName.Punctuation).data !== "}",
            (s) => {
              const next = s.expect(["{", ","], TokenTypeName.Punctuation);
              if (next.data === "...") {
                return ExpressionTupleSpread.Parse(next, namespace, [...lookFor, ",", "}"]);
              }

              return ExpressionTuplePart.Parse(next, namespace, [...lookFor, ",", "}"]);
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

        return new ExpressionTuple(_context(walker, done, namespace), value ?? []);
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

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx
      .mapWith(this.#parts, "parts", (c, i) => i.linked(left, c))
      .finish(
        ({ parts }) =>
          new LinkedExpressionTuple(
            this.range,
            parts.flatMap((p) => {
              if (!(p instanceof LinkedExpressionTuple)) {
                throw new LinkerError("Tuple parts required", p.range);
              }

              return p.parts;
            }),
          ),
      );
  }
}
