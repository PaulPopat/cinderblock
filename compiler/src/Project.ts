import { EntityExternal, EntityLet, Expression, TokenWalker } from "#ast";
import { Tokeniser, TokenStore } from "#tokeniser";
import path from "node:path";
import { App } from "./App.ts";
import fs from "node:fs";
import * as std from "#std";
import { Frame, framise } from "#runner";

export class Project {
  readonly #root: string;
  readonly #std: Frame = framise(std);

  constructor(root: string) {
    this.#root = root;
  }

  get root() {
    return this.#root;
  }

  app(globals: Record<string, unknown>) {
    const files = fs.readdirSync(this.#root, { recursive: true, encoding: "utf-8" });

    const store = files
      .filter((f) => f.endsWith(".cb"))
      .map((f) => [f, fs.readFileSync(path.resolve(this.#root, f), "utf8")] as const)
      .reduce((store, [key, value]) => store.with(new Tokeniser(key, value).tokens), TokenStore.start([]));
    const [entities] = Expression.GetEntities(
      TokenWalker.start(store, [
        ...Object.entries(std).map(([key, value]) => new EntityExternal(key, value)),
        ...Object.entries(globals).map(([key, value]) => new EntityExternal(key, typeof value === "function" ? value : () => value)),
      ]),
    );
    return new App(entities.filter((e) => e instanceof EntityLet));
  }
}
