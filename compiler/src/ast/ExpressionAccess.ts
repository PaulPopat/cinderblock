import { VariableTuple, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { TypeTuple } from "./TypeTuple.ts";

export class ExpressionAccess extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\.$/gm,
      factory: this,
    });
  }

  readonly #subject: Expression;
  readonly #name: string;

  constructor(walker: TokenWalker, parent: Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected .", walker.store);

    const [{ name }, done] = walker.expect(".").text("name").finish();
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
    const subjectType = this.#subject.resolution;
    if (!(subjectType instanceof TypeTuple)) throw new LinkerError("Subject is not accessible", this.location);

    const property = subjectType.args.find((a) => a.name === this.#name);

    if (!property) throw new LinkerError("Could not find property", this.location);

    return property.type;
  }

  async resolve(closure: Closure): Promise<Variable> {
    const subject = await this.#subject.resolve(closure);
    if (!(subject instanceof VariableTuple)) throw new Error("Subject not tuple");

    return subject.get(this.#name);
  }
}
