import { TokenWalker, TokenTypeName } from "#tokeniser";
import type { Instruction, CreateFunc } from "#writer";
import { EntityArg } from "./EntityArg.ts";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { Namer } from "./Namer.ts";
import { Type } from "./Type.ts";
import { TypePipeable } from "./TypePipeable.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export class ExpressionFunc extends Expression {
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

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ args, returns, contents }, done] = walker
      .expect("let", TokenTypeName.KeyWord)
      .while(
        "args",
        (s) => s.data === "," || s.data === "(",
        (s) => new EntityArg(s.expect(["(", ","], TokenTypeName.Punctuation), () => this),
      )
      .expect(")", TokenTypeName.Punctuation)
      .if(
        (s) => s.data === ":",
        (walker) => walker.expect(":", TokenTypeName.Punctuation).extract("returns", (s) => Type.Parse(s, () => this)),
      )
      .expect("=", TokenTypeName.Operator)
      .extract("contents", (s) => Expression.Parse(s, () => this, [";"]))
      .expect(";", TokenTypeName.Punctuation)
      .finish();

    super(walker.location, done, parent);
    this.#args = args ?? [];
    this.#returns = returns;
    this.#contents = contents;
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
    );
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
