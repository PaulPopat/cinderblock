import { TypeArg } from "./TypeArg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { ExpressionTuplePart } from "./ExpressionTuplePart.ts";
import { VariableTuple, type Closure, type Variable } from "#runner";

export class ExpressionTuple extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^{$/gm,
      parse: (w, lookFor) => {
        return w
          .if(
            (w) => w.next.data !== "}",
            (w) =>
              w.while(
                "value",
                (w) => w.data === "{" || w.data === ",",
                (s) =>
                  s.next
                    .text("name")
                    .expect("=")
                    .extract("value", (s) => Expression.Parse(s, [...lookFor, ",", "}"]))
                    .finish(({ name, value }, ctx) => new ExpressionTuplePart(ctx, name.startsWith('"') ? JSON.parse(name) : name, value)),
              ),
          )
          .if(
            (w) => w.data === "{",
            (w) => w.expect("{"),
          )
          .expect("}")
          .finish(({ value }, ctx) => {
            return new ExpressionTuple(ctx, value ?? []);
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

  async resolve(closure: Closure): Promise<Variable> {
    const inputs = Object.fromEntries(await Promise.all(this.#parts.map(async (next) => [next.name, await next.value.resolve(closure)] as const)));

    return new VariableTuple(inputs);
  }
}
