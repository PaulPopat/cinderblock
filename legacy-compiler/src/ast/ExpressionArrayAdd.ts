import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import { TypeArray } from "./TypeArray.ts";
import { WriterError } from "./WriterError.ts";
import type { Type } from "./Type.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export class ExpressionArrayAdd extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\+\+$/gm,
      factory: this,
    });
  }

  readonly #subject: Expression;
  readonly #addition: Expression;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected ++", walker);
    const [{ addition }, done] = walker
      .expect("++", TokenTypeName.Operator)
      .extract("addition", (w) => Expression.Parse(w, () => this, lookFor))
      .finish();
    super(walker.location, done, parent);
    this.#subject = existing;
    this.#addition = addition;
  }

  get subject() {
    return this.#subject;
  }

  get addition() {
    return this.#addition;
  }

  resolution(invocationType: TypeTuple): Type {
    return this.#subject.resolution(invocationType);
  }

  instruction(invocationType: TypeTuple): Instruction {
    if (!(this.#subject.resolution(invocationType) instanceof TypeArray)) {
      throw new WriterError("Left must be array", this.range);
    }

    return {
      type: "array_add",
      left: this.#subject.instruction(invocationType),
      right: this.#addition.instruction(invocationType),
    };
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return [...this.#subject.funcs(invocationType), ...this.#addition.funcs(invocationType)];
  }
}
