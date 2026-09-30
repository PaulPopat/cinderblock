import { TokenWalker, TokenTypeName } from "#tokeniser";
import type { Instruction, CreateFunc } from "#writer";
import { Entity } from "./Entity.ts";
import { EntityArg } from "./EntityArg.ts";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { Type } from "./Type.ts";
import { TypePipeable } from "./TypePipeable.ts";

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
  readonly #entities: Array<Entity>;
  readonly #contents: Expression;
  readonly #internalName: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ args, returns, contents, entities, internalName }, done] = walker
      .expect("let", TokenTypeName.KeyWord, () => this)
      .internal("internalName")
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
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, () => this),
      )
      .extract("contents", (s) => Expression.Parse(s, () => this, [";"]))
      .expect(";", TokenTypeName.Punctuation)
      .finish();

    super(walker.location, done, parent);
    this.#args = args ?? [];
    this.#returns = returns;
    this.#entities = entities;
    this.#contents = contents;
    this.#internalName = internalName;
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
    ).flattened();
  }

  get instruction(): Instruction {
    return { type: "reference", name: this.#internalName };
  }

  dig(name: string): Entry | undefined {
    return this.#entities.reduce((result, entity) => result ?? entity.dig(name), undefined as Entry | undefined);
  }

  float(name: string): Entry | undefined {
    return this.dig(name) ?? this.#args.reduce((result, arg) => result ?? arg.dig(name), undefined as Entry | undefined) ?? super.float(name);
  }

  get funcs(): Array<CreateFunc> {
    return [
      {
        name: this.#internalName,
        vars: [...this.#entities.flatMap((e) => e.model), ...this.#contents.funcs],
        returns: this.#contents.instruction,
        no_args: false,
        tags: {},
      },
    ];
  }
}
