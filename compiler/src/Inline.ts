import { Entity, EntityExternal } from "#ast";
import { Tokeniser, TokenType, TokenWalker } from "#tokeniser";
import { App } from "./App.ts";
import * as std from "#std";

export class Inline extends App {
  readonly #code: string;
  readonly #entities: Entity[];
  readonly #types: Array<TokenType>;

  constructor(code: string, globals: Record<string, unknown> = {}) {
    super();
    this.#code = code;
    const [{ entities }, done] = TokenWalker.start([])
      .with(new Tokeniser("inline", this.#code).tokens)
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
    this.#types = done.types;
  }

  get entities() {
    return this.#entities;
  }

  get types() {
    return this.#types;
  }
}
