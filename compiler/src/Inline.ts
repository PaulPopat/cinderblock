import { Entity, EntityExternal, TokenWalker } from "#ast";
import { Tokeniser, TokenStore } from "#tokeniser";
import { App } from "./App.ts";
import * as std from "#std";

export class Inline extends App {
  readonly #code: string;
  readonly #entities: Entity[];

  constructor(code: string, globals: Record<string, unknown> = {}) {
    super();
    this.#code = code;
    const [{ entities }] = TokenWalker.start(TokenStore.start([]).with(new Tokeniser("inline", this.#code).tokens))
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, () => this),
      )
      .finish();

    this.#entities = [
      ...entities,
      ...Object.entries(std).map(([key, value]) => new EntityExternal(key, value)),
      ...Object.entries(globals).map(([key, value]) => new EntityExternal(key, typeof value === "function" ? value : () => value)),
    ];
  }

  get entities() {
    return this.#entities;
  }
}
