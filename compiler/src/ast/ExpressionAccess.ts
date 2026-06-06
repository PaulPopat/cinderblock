import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { TypeTuple } from "./TypeTuple.ts";

export class ExpressionAccess extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\.$/gm,
      parse: (w, _, left) => {
        if (!left) throw new ParserError("Unexpected .", w.store);
        return w
          .expect(".")
          .text("name")
          .finish(({ name }, ctx) => new ExpressionAccess(ctx, left, name));
      },
    });
  }

  readonly #subject: Expression;
  readonly #name: string;

  constructor(ctx: EntryContext, subject: Expression, name: string) {
    super(ctx);
    this.#subject = subject;
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
    if (!(subjectType instanceof TypeTuple))
      throw new LinkerError("Subject is not accessible", this.ctx.start);

    const property = subjectType.args.find((a) => a.name === this.#name);

    if (!property)
      throw new LinkerError("Could not find property", this.ctx.start);

    return property.type;
  }
}
