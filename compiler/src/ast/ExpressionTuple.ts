import { TypeArg } from "./TypeArg.ts";
import { Expression } from "./Expression.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { ExpressionTuplePart } from "./ExpressionTuplePart.ts";
import { VariableTuple, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";

export class ExpressionTuple extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^{$/gm,
      factory: this,
    });
  }

  readonly #parts: Array<ExpressionTuplePart>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker
      .if(
        (w) => w.next.data !== "}",
        (w) =>
          w.while(
            "value",
            (w) => (w.data === "{" || w.data === ",") && w.next.data !== "}",
            (s) => new ExpressionTuplePart(s.next, () => this, [...lookFor, ",", "}"], undefined),
          ),
      )
      .if(
        (w) => w.data === "{",
        (w) => w.expect("{"),
      )
      .if(
        (w) => w.data === ",",
        (w) => w.expect(","),
      )
      .expect("}")
      .finish();
    super(walker.location, done, parent);
    this.#parts = value ?? [];
  }

  get parts() {
    return this.#parts;
  }

  partOf(name: string) {
    return this.#parts.find((p) => p.name === name);
  }

  get resolution() {
    return new TypeTuple(
      this.location,
      this.done,
      () => this,
      this.#parts.map((part) => new TypeArg(this.location, this.done, () => this, part.value.resolution, part.name)),
    );
  }

  async resolve(closure: Closure): Promise<Variable> {
    const inputs = Object.fromEntries(await Promise.all(this.#parts.map(async (next) => [next.name, await next.value.resolve(closure)] as const)));

    return new VariableTuple(inputs);
  }
}
