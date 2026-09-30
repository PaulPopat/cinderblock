import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { LinkerError } from "./LinkerError.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import { EntityLet } from "./EntityLet.ts";
import { EntityArg } from "./EntityArg.ts";
import { EntityExternal } from "./EntityExternal.ts";
import { WriterError } from "./WriterError.ts";
import type { Type } from "./Type.ts";
import { TypeArg } from "./TypeArg.ts";

export class ExpressionReference extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^[a-zA-Z_@$#:][a-zA-Z0-9_@$#:]*$/gm,
      factory: this,
    });
  }

  readonly #name: string;
  readonly #generics: Array<TypeArg>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value, args }, done] = walker
      .text("value", TokenTypeName.VariableName, () => this)
      .if(
        (s) => s.data === "<",
        (s) =>
          s
            .expect("<", TokenTypeName.Punctuation)
            .while(
              "args",
              (s) => s.data !== ">",
              (s): TypeArg => TypeArg.Parse(s, () => this),
            )
            .expect(">", TokenTypeName.Punctuation),
      )
      .finish();
    super(walker.location, done, parent);
    this.#name = value;
    this.#generics = args ?? [];
  }

  get name() {
    return this.#name;
  }

  get subject() {
    const result = this.float(this.#name);
    if (result instanceof EntityLet && this.#generics.length) {
      return new EntityLet(result, this.#generics);
    }

    if (!(result instanceof EntityLet) && !(result instanceof EntityArg) && !(result instanceof EntityExternal)) {
      throw new LinkerError("Unresolved reference", this.range);
    }

    return result;
  }

  get resolution(): Type {
    return this.subject.type.flattened();
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

    throw new WriterError("Unknown subject type", this.range);
  }

  get funcs(): Array<CreateFunc> {
    return [];
  }
}
