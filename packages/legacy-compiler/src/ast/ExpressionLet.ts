import { LinkedExpression } from "#linked/LinkedExpression";
import { LinkedExpressionLet } from "#linked/LinkedExpressionLet";
import { LinkedTypeTuple } from "#linked/LinkedTypeTuple";
import { TokenTypeName, TokenWalker } from "#tokeniser";
import { Entity } from "./Entity.ts";
import { EntityArg } from "./EntityArg.ts";
import { EntityLet } from "./EntityLet.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";

export class ExpressionLet extends Expression {
  static Parse(walker: TokenWalker, namespace: string, lookFor: Array<string>) {
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
              (s) => EntityArg.Parse(s.expect(["(", ","], TokenTypeName.Punctuation), namespace),
            )
            .expect(")", TokenTypeName.Punctuation),
      )
      .if(
        (s) => s.data === ":",
        (walker) => walker.expect(":", TokenTypeName.Punctuation).extract("returns", (s) => Type.Parse(s, namespace)),
      )
      .expect("=", TokenTypeName.Operator)
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, ""),
      )
      .extract("contents", (s) => Expression.Parse(s, namespace, lookFor))
      .finish();

    return new ExpressionLet(_context(walker, done, namespace), args ?? [], returns, entities, contents, internalName);
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

  linked(input: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpressionLet] {
    const inputType = input?.resolution ?? LinkedTypeTuple.empty;
    if (!(inputType instanceof LinkedTypeTuple)) {
      throw new LinkerError("Tuple required", inputType.range);
    }

    return ctx
      .mapWith(this.#args, "args", (c, i) =>
        i.linked(
          inputType.args.find((a) => a.name === i.name),
          c,
        ),
      )
      .mapWith(
        this.#entities.filter((e) => e instanceof EntityLet),
        "children",
        (c, e) => e.linked(undefined, c),
      )
      .with("contents", (c) => this.#contents.linked(undefined, c))
      .with("returns", (c, { contents }) => this.#returns?.linked(undefined, c) ?? [ctx, contents.resolution])
      .finish(({ args, contents, returns, children }) => {
        return new LinkedExpressionLet(this.range, this.#internalName, args, returns, children, contents);
      });
  }
}
