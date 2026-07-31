import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { TypeUnion } from "./TypeUnion.ts";

export class ExpressionMap extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^:\?$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected :?", w.store);
        return w
          .expect(":?")
          .while(
            "possible",
            (s) => s.data !== ";",
            (w) => Expression.Parse(w, [...(typeof lookFor === "string" ? [lookFor] : lookFor), ","]),
          )
          .finish(({ possible }, ctx) => new ExpressionMap(ctx, e, possible));
      },
    });
  }

  readonly #subject: Expression;
  readonly #possible: Array<Expression>;

  constructor(ctx: EntryContext, subject: Expression, possible: Array<Expression>) {
    super(ctx);
    this.#subject = subject;
    this.#possible = possible;
  }

  get subject() {
    return this.#subject;
  }

  get possible() {
    return this.#possible;
  }

  get resolution() {
    return new TypeUnion(
      this.ctx,
      this.#possible.map((p) => {
        const type = p.resolution;

        if (!(type instanceof TypePipeable)) throw new LinkerError("Must be a pipeable", p.ctx.start);
        if (type.args.length != 1) throw new LinkerError("One arg is required", p.ctx.start);

        return type.returns;
      }),
    );
  }
}
