import { Entity } from "#ast";
import { Tokeniser, TokenType, TokenWalker } from "#tokeniser";
import path from "node:path";
import { App } from "./App.ts";
import fs from "node:fs";

export class Project extends App {
  readonly #root: string;
  readonly #types: Array<TokenType>;

  constructor(root: string) {
    const [{ entities }, done] = TokenWalker.start(
      fs
        .readdirSync(root, { recursive: true, encoding: "utf-8" })
        .filter((f) => f.endsWith(".cb"))
        .map((f) => [f, fs.readFileSync(path.resolve(root, f), "utf8")] as const)
        .flatMap(([key, value]) => new Tokeniser(key, value).tokens),
    )
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, () => this),
      )
      .finish();

    super(entities);
    this.#root = root;
    this.#types = done.types;
  }

  get root() {
    return this.#root;
  }

  get types() {
    return this.#types;
  }
}
