import { Entity } from "#ast";
import { Tokeniser, TokenType, TokenWalker } from "#tokeniser";
import path from "node:path";
import { App } from "./App.ts";
import fs from "node:fs";
import type { CinderBlockBinary } from "@cinderblock-lang/runner";

export class Project extends App {
  readonly #roots: Array<string>;
  readonly #types: Array<TokenType>;

  constructor(...roots: Array<string>) {
    const [{ entities }, done] = TokenWalker.start(
      roots.flatMap((root) =>
        fs
          .readdirSync(root, { recursive: true, encoding: "utf-8" })
          .filter((f) => f.endsWith(".cb"))
          .map((f) => [f, fs.readFileSync(path.resolve(root, f), "utf8")] as const)
          .flatMap(([key, value]) => new Tokeniser(key, value).tokens),
      ),
    )
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, () => this),
      )
      .finish();

    super(entities);
    this.#roots = roots;
    this.#types = done.types;
  }

  compile() {
    try {
      fs.mkdirSync(path.resolve(this.root, ".cinder"), { recursive: true });
    } catch {}

    const { data, metadata } = this.binaryData;
    fs.writeFileSync(path.resolve(this.root, ".cinder/app.block"), data);
    fs.writeFileSync(path.resolve(this.root, ".cinder/metadata.json"), JSON.stringify(metadata));
  }

  binary(globals?: Record<string, unknown>): CinderBlockBinary {
    return super.binary(globals);
  }

  get root() {
    return this.#roots[0]!;
  }

  get types() {
    return this.#types;
  }
}
