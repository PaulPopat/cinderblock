import { EntityLet, Expression, TokenWalker } from "#ast";
import { framise } from "#runner";
import { Tokeniser, TokenStore } from "#tokeniser";
import { App } from "./App.ts";

export class Inline {
  readonly #code: string;

  constructor(code: string) {
    this.#code = code;
  }

  get app() {
    const store = TokenStore.start([]).with(new Tokeniser("inline", this.#code).tokens);
    const [entities] = Expression.GetEntities(TokenWalker.start(store, []));

    return new App(
      entities.filter((e) => e instanceof EntityLet),
      framise({}),
    );
  }
}
