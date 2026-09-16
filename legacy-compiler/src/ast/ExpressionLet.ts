import { TokenWalker, TokenTypeName } from "#tokeniser";
import type { Instruction, CreateFunc } from "#writer";
import { EntityArg } from "./EntityArg.ts";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { Namer } from "./Namer.ts";
import { Type } from "./Type.ts";
import { TypePipeable } from "./TypePipeable.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export class ExpressionLet extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^let$/gm,
      factory: this,
    });
  }

  readonly #args: Array<EntityArg>;
  readonly #returns: Type | undefined;
  readonly #contents: Expression;
  readonly #internalName = Namer.Next;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined);
  constructor(base: ExpressionLet, newArgs: TypeTuple);
  constructor(
    ...input:
      | [walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined]
      | [base: ExpressionLet, newArgs: TypeTuple]
  ) {
    if (input.length === 4) {
      const [walker, parent] = input;
      const [{ args, returns, contents }, done] = walker
        .expect("let", TokenTypeName.KeyWord, () => this)
        .if(
          (s) => s.data === "(",
          (walker) =>
            walker
              .while(
                "args",
                (s) => s.data === "," || s.data === "(",
                (s) => new EntityArg(s.expect(["(", ","], TokenTypeName.Punctuation), () => this),
              )
              .expect(")", TokenTypeName.Punctuation),
        )
        .if(
          (s) => s.data === ":",
          (walker) => walker.expect(":", TokenTypeName.Punctuation).extract("returns", (s) => Type.Parse(s, () => this)),
        )
        .expect("=", TokenTypeName.Operator, () => this)
        .extract("contents", (s) => Expression.Parse(s, () => this, [";"]))
        .expect(";", TokenTypeName.Punctuation)
        .finish();

      super(walker.location, done, parent);
      this.#args = args ?? [];
      this.#returns = returns;
      this.#contents = contents;
    } else {
      const [base, newArgs] = input;
      super(base.location, base.done, () => base.parent);
      this.#args = base.#args.map((a) => {
        const possible = newArgs.args.find((b) => b.name === a.name);
        if (possible) {
          return new EntityArg(possible);
        }

        return a;
      });
      this.#returns = base.#returns;
      this.#contents = base.#contents;
    }
  }

  get args() {
    return this.#args;
  }

  get resolution(): TypePipeable {
    return new TypePipeable(
      this.location,
      this.done,
      () => this,
      this.#args.map((a) => a.typeArg),
      this.#returns ?? this.#contents.resolution,
    ).flattened({});
  }

  get instruction(): Instruction {
    return { type: "reference", name: this.#internalName };
  }

  float(name: string): Entry | undefined {
    return this.#args.reduce((result, arg) => result ?? arg.dig(name), undefined as Entry | undefined) ?? super.float(name);
  }

  get funcs(): Array<CreateFunc> {
    return [
      {
        name: this.#internalName,
        vars: [],
        returns: this.#contents.instruction,
        no_args: false,
        tags: {},
      },
    ];
  }
}
