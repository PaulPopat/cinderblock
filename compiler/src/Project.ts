import { EntityLet, Expression, TokenWalker } from "#ast";
import { Tokeniser, TokenStore } from "#tokeniser";
import path from "node:path";
import { App } from "./App.ts";
import fs from "node:fs";
import { CompilerError } from "#utils";

export class Project {
  readonly #root: string;

  constructor(root: string) {
    this.#root = root;
  }

  get app() {
    const files = fs.readdirSync(this.#root, { recursive: true, encoding: "utf-8" });

    try {
      const store = files
        .filter((f) => f.endsWith(".cb"))
        .map((f) => [f, fs.readFileSync(path.resolve(this.#root, f), "utf8")] as const)
        .reduce((store, [key, value]) => store.with(new Tokeniser(key, value).tokens), TokenStore.start([]));
      const entities = Expression.GetEntities(TokenWalker.start(store));
      return new App(entities.filter((e) => e instanceof EntityLet));
    } catch (err) {
      if (err instanceof CompilerError) {
        throw new Error(
          [
            ["Error", err.message].join(": "),
            ["Files", err.location.file].join(": "),
            ["Line", err.location.line].join(": "),
            ["Character", err.location.character].join(": "),
          ].join("\n"),
        );
      }

      throw err;
    }
  }
}
