import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";
import { TypeArray } from "./TypeArray.ts";
import { WriterError } from "./WriterError.ts";

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

  get resolution() {
    return this.#subject.resolution;
  }

  get instruction(): Instruction {
    if (!(this.#subject.resolution instanceof TypeArray)) {
      throw new WriterError("Left must be array", this.location);
    }

    return {
      type: "array_add",
      left: this.#subject.instruction,
      right: this.#addition.instruction,
    };
  }
}
