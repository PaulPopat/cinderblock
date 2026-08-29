import { VariableTuple, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypeReference } from "./TypeReference.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { WriterError } from "./WriterError.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";

export class ExpressionAccess extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\.$/gm,
      inOne: true,
      factory: this,
    });
  }

  readonly #subject: Expression;
  readonly #name: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected .", walker);

    const [{ name }, done] = walker.expect(".", TokenTypeName.Operator).text("name", TokenTypeName.PropertyReference).finish();
    super(walker.location, done, parent);
    this.#subject = existing;
    this.#name = name;
  }

  get subject() {
    return this.#subject;
  }

  get name() {
    return this.#name;
  }

  get resolution() {
    let subjectType = this.#subject.resolution;
    if (!(subjectType instanceof TypeTuple) && !(subjectType instanceof TypeReference))
      throw new LinkerError("Subject is not accessible", this.location);

    const property = subjectType.args.find((a) => a.name === this.#name);

    if (!property) throw new LinkerError("Could not find property", this.location);

    return property.type;
  }

  async resolve(closure: Closure): Promise<Variable> {
    const subject = await this.#subject.resolve(closure);
    if (!(subject instanceof VariableTuple)) throw new WriterError("Subject not tuple", this.location);

    return subject.get(this.#name, this.location);
  }

  get instruction(): Instruction {
    let subjectType = this.#subject.resolution;
    if (!(subjectType instanceof TypeTuple) && !(subjectType instanceof TypeReference)) {
      throw new WriterError("Left must be array", this.location);
    }

    if (!subjectType.args.some((a) => a.name === this.#name)) {
      throw new WriterError("Could not find property", this.location);
    }

    return {
      type: "access",
      subject: this.#subject.instruction,
      key: this.#name,
    };
  }
}
