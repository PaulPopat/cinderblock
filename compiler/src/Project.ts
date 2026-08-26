import { Entity, EntityExternal } from "#ast";
import { Tokeniser, TokenWalker } from "#tokeniser";
import path from "node:path";
import { App } from "./App.ts";
import fs from "node:fs";
import * as std from "#std";

export class Project extends App {
  readonly #root: string;
  readonly #globals: Record<string, unknown>;
  readonly #entities: Array<Entity>;

  constructor(root: string, globals: Record<string, unknown>) {
    super();
    this.#root = root;
    this.#globals = globals;

    const [{ entities }] = TokenWalker.start(
      fs
        .readdirSync(this.#root, { recursive: true, encoding: "utf-8" })
        .filter((f) => f.endsWith(".cb"))
        .map((f) => [f, fs.readFileSync(path.resolve(this.#root, f), "utf8")] as const)
        .flatMap(([key, value]) => new Tokeniser(key, value).tokens),
    )
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, () => this),
      )
      .finish();

    this.#entities = [
      ...entities,
      ...Object.entries(std).map(([key, value]) => new EntityExternal(key, value)),
      ...Object.entries(this.#globals).map(([key, value]) => new EntityExternal(key, typeof value === "function" ? value : () => value)),
    ];
  }

  get root() {
    return this.#root;
  }

  get entities() {
    return this.#entities;
  }
}
