import { TypeArg } from "./TypeArg.ts";
import { Expression } from "./Expression.ts";
import { TypeTuple } from "./TypeTuple.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import type { Type } from "./Type.ts";

export class ExpressionTuplePart extends Expression {
  readonly #name: string;
  readonly #value: Expression;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ name, value }, done] = walker
      .text("name", TokenTypeName.PropertyName, () => this)
      .expect("=", TokenTypeName.Operator)
      .extract("value", (s) => Expression.Parse(s, () => this, lookFor))
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

  get resolution(): Type {
    return new TypeTuple(this.location, this.done, () => this, [
      new TypeArg(this.location, this.done, () => this, this.#value.resolution, this.#name),
    ]).flattened({});
  }

  get instruction(): Instruction {
    return this.#value.instruction;
  }

  get funcs(): Array<CreateFunc> {
    return this.#value.funcs;
  }
}
