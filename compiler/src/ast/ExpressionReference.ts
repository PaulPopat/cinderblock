import { Frame, VariablePipeable, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { LinkerError } from "./LinkerError.ts";
import { EntityReferenceable } from "./EntityReferenceable.ts";

export class ExpressionReference extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^[a-zA-Z_@$#:][a-zA-Z0-9_@$#:]*$/gm,
      factory: this,
    });
  }

  readonly #name: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker.text("value").finish();
    super(walker.location, done, parent);
    this.#name = value;
  }

  get name() {
    return this.#name;
  }

  get subject() {
    const result = this.find(this.#name);
    if (!(result instanceof EntityReferenceable)) {
      throw new LinkerError("Unresolved reference", this.location);
    }

    return result;
  }

  get resolution() {
    return this.subject.type;
  }

  async resolve(closure: Closure): Promise<Variable> {
    const value = closure.search(this.subject.internalName, this.#name, this.location);

    if (value instanceof VariablePipeable && value.noArgs) {
      return value.execute(new Frame({}));
    }

    return value;
  }
}
