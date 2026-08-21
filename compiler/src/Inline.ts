import { Entity, TokenWalker } from "#ast";
import { Tokeniser, TokenStore } from "#tokeniser";
import { App } from "./App.ts";

export class Inline extends App {
  readonly #code: string;
  readonly #entities: Entity[];

  constructor(code: string) {
    super();
    this.#code = code;
    const [{ entities }] = TokenWalker.start(TokenStore.start([]).with(new Tokeniser("inline", this.#code).tokens))
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, () => this),
      )
      .finish();

    this.#entities = entities;
  }

  get entities() {
    return this.#entities;
  }
}
