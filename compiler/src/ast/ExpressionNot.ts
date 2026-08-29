import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";

export class ExpressionNot extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\!$/gm,
      inOne: false,
      factory: this,
    });
  }

  readonly #subject: Expression;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ subject }, done] = walker
      .expect("!", TokenTypeName.Operator)
      .extract("subject", (w) => Expression.ParseOne(w, () => this))
      .finish();
    super(walker.location, done, parent);
    this.#subject = subject;
  }

  get subject() {
    return this.#subject;
  }

  get resolution() {
    let subjectType = this.#subject.resolution;
    if (!(subjectType instanceof TypePrimitiveBool)) {
      throw new LinkerError("Boolean required", this.location);
    }

    return new TypePrimitiveBool(this.location, this.done, () => this);
  }

  get instruction(): Instruction {
    if (!(this.#subject.resolution instanceof TypePrimitiveBool)) {
      throw new LinkerError("Boolean required", this.location);
    }

    return { type: "not", subject: this.#subject.instruction };
  }
}
