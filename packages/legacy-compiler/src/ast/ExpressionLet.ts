import { TokenTypeName, TokenWalker } from "#tokeniser";
import { Entity } from "./Entity.ts";
import { EntityArg } from "./EntityArg.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { Type } from "./Type.ts";

export class ExpressionLet extends Expression {
  static Parse(walker: TokenWalker, lookFor: Array<string>) {
    const [{ args, returns, contents, entities, internalName }, done] = walker
      .expect("let", TokenTypeName.KeyWord)
      .internal("internalName")
      .if(
        (s) => s.data === "(",
        (walker) =>
          walker
            .while(
              "args",
              (s) => s.data === "," || s.data === "(",
              (s) => EntityArg.Parse(s.expect(["(", ","], TokenTypeName.Punctuation)),
            )
            .expect(")", TokenTypeName.Punctuation),
      )
      .if(
        (s) => s.data === ":",
        (walker) => walker.expect(":", TokenTypeName.Punctuation).extract("returns", (s) => Type.Parse(s)),
      )
      .expect("=", TokenTypeName.Operator)
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w),
      )
      .extract("contents", (s) => Expression.Parse(s, lookFor))
      .finish();

    return new ExpressionLet(_context(walker, done), args ?? [], returns, entities, contents, internalName);
  }

  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^let$/gm,
      factory: ExpressionLet.Parse,
    });
  }

  readonly #args: Array<EntityArg>;
  readonly #returns: Type | undefined;
  readonly #entities: Array<Entity>;
  readonly #contents: Expression;
  readonly #internalName: string;

  constructor(
    ctx: EntryContext,
    args: Array<EntityArg>,
    returns: Type | undefined,
    entities: Array<Entity>,
    contents: Expression,
    internalName: string,
  ) {
    super(ctx);
    this.#args = args;
    this.#returns = returns;
    this.#entities = entities;
    this.#contents = contents;
    this.#internalName = internalName;
  }

  get args() {
    return this.#args;
  }
}
