import { EntityLet, Expression, TokenWalker } from "#ast";
import { Tokeniser, TokenStore } from "#tokeniser";
import path from "node:path";
import { App } from "./App.ts";
import fs from "node:fs";

export class Project {
  readonly #root: string;

  constructor(root: string) {
    this.#root = root;
  }

  get app() {
    const files = fs.readdirSync(this.#root, { recursive: true, encoding: "utf-8" });

    const store = files
      .filter((f) => f.endsWith(".cb"))
      .map((f) => [f, fs.readFileSync(path.resolve(this.#root, f), "utf8")] as const)
      .reduce((store, [key, value]) => store.with(new Tokeniser(key, value).tokens), TokenStore.start([]));
    const [expression] = Expression.Parse(TokenWalker.start(store));

    return new App(expression.entities.filter((e) => e instanceof EntityLet));
  }
}
