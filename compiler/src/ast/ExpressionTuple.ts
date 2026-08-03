import { TypeArg } from "./TypeArg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { ExpressionTuplePart } from "./ExpressionTuplePart.ts";
import { VariableTuple, type Closure, type Variable } from "#runner";

export class ExpressionTuple extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^,$/gm,
      parse: (w, lookFor, left) => {
        return w
          .expect(",")
          .extract("right", (w) => Expression.Parse(w, lookFor))
          .finish(({ right }, ctx) => {
            if (!(left instanceof ExpressionTuplePart) && !(left instanceof ExpressionTuple)) {
              throw new ParserError("Unexpected ,", w.store);
            }

            if (!(right instanceof ExpressionTuplePart) && !(right instanceof ExpressionTuple)) {
              throw new ParserError("Unexpected right", w.store);
            }

            return new ExpressionTuple(ctx, [
              ...(left instanceof ExpressionTuple ? left.parts : [left]),
              ...(right instanceof ExpressionTuple ? right.parts : [right]),
            ]);
          });
      },
    });
  }

  readonly #parts: Array<ExpressionTuplePart>;

  constructor(ctx: EntryContext, parts: Array<ExpressionTuplePart>) {
    super(ctx);
    this.#parts = parts;
  }

  get parts() {
    return this.#parts;
  }

  partOf(name: string) {
    return this.#parts.find((p) => p.name === name);
  }

  get resolution() {
    return new TypeTuple(
      this.ctx,
      this.#parts.map((part) => new TypeArg(this.ctx, part.value.resolution, part.name)),
    );
  }

  resolve(closure: Closure): Variable {
    const inputs = this.#parts.reduce(
      (current, next) => ({
        ...current,
        [next.name]: next.value.resolve(closure),
      }),
      {} as Record<string, Variable>,
    );

    return new VariableTuple(inputs);
  }
}
