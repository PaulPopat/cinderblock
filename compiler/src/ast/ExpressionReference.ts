import { Frame, VariablePipeable, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { LinkerError } from "./LinkerError.ts";
import { TokenTypeName } from "#tokeniser";
import type { IEntityReferenceable } from "./IEntityReferenceable.ts";
import type { Instruction } from "#writer";
import { EntityLet } from "./EntityLet.ts";
import { EntityArg } from "./EntityArg.ts";
import { EntityExternal } from "./EntityExternal.ts";
import { WriterError } from "./WriterError.ts";

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
    const [{ value }, done] = walker.text("value", TokenTypeName.VariableName).finish();
    super(walker.location, done, parent);
    this.#name = value;
  }

  get name() {
    return this.#name;
  }

  get subject() {
    const result = this.float(this.#name);
    if (!result || !("reference" in result)) {
      throw new LinkerError("Unresolved reference", this.location);
    }

    return result as IEntityReferenceable;
  }

  get resolution() {
    return this.subject.type;
  }

  async resolve(closure: Closure): Promise<Variable> {
    const value = closure.search(this.subject.internalName);

    if (value instanceof VariablePipeable && value.noArgs) {
      return value.execute(new Frame({}));
    }

    return value;
  }

  get instruction(): Instruction {
    const subject = this.float(this.#name);
    if (subject instanceof EntityLet) {
      return { type: "reference", name: subject.internalName };
    } else if (subject instanceof EntityArg) {
      return { type: "arg", name: subject.name };
    } else if (subject instanceof EntityExternal) {
      return { type: "external", name: subject.name };
    }

    throw new WriterError("Unknown subject type", this.location);
  }
}
