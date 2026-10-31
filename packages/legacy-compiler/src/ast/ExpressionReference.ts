import { Expression } from "./Expression.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { BoundEntry } from "./BoundEntry.ts";
import { LinkerError } from "./LinkerError.ts";
import { EntityExternal } from "./EntityExternal.ts";
import { EntityLet } from "./EntityLet.ts";
import type { LinkedEntry } from "#linked/LinkedEntry";
import { LinkedExpressionReference } from "#linked/LinkedExpressionReference";
import { LinkedTypeArg } from "#linked/LinkedTypeArg";

export class ExpressionReference extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^[a-zA-Z_@$#:][a-zA-Z0-9_@$#:]*$/gm,
      factory: (walker, namespace, lookFor, existing) => {
        const [{ value }, done] = walker.text("value", TokenTypeName.VariableName).finish();
        return new ExpressionReference(_context(walker, done, namespace), value);
      },
    });
  }

  readonly #name: string;

  constructor(ctx: EntryContext, name: string) {
    super(ctx);
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  linked(input: LinkedEntry | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    const found = ctx.search(this.#name, this.range);
    if (found instanceof LinkedExpression || found instanceof LinkedTypeArg) {
      return ctx.finish(() => new LinkedExpressionReference(this.range, found));
    }

    if (found instanceof BoundEntry) {
      if (found.is(EntityExternal)) {
        const [, result] = found.subject.linked(input, found.context);

        return ctx.finish(() => new LinkedExpressionReference(this.range, result));
      }

      if (found.is(EntityLet)) {
        const [, result] = found.subject.linked(input, found.context);
        return ctx.finish(() => new LinkedExpressionReference(this.range, result));
      }
    }

    throw new LinkerError("Reference not found", this.range);
  }
}
