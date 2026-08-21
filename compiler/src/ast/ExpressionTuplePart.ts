import { TypeArg } from "./TypeArg.ts";
import { Expression } from "./Expression.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { VariableTuple, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "./TokenWalker.ts";

export class ExpressionTuplePart extends Expression {
  readonly #name: string;
  readonly #value: Expression;

  constructor(walker: TokenWalker, parent: Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ name, value }, done] = walker
      .text("name")
      .expect("=")
      .extract("value", (s) => Expression.Parse(s, this, lookFor))
      .finish();
    super(walker.location, done, parent);
    this.#name = name.startsWith('"') ? JSON.parse(name) : name;
    this.#value = value;
  }

  get name() {
    return this.#name;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypeTuple(this.location, this.done, this, [new TypeArg(this.location, this.done, this, this.#value.resolution, this.#name)]);
  }

  async resolve(closure: Closure): Promise<Variable> {
    return new VariableTuple({
      [this.#name]: await this.#value.resolve(closure),
    });
  }
}
