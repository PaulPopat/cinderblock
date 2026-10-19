import path from "node:path";
import fs from "node:fs";
import esbuild from "esbuild";
import crypto from "node:crypto";
import { loadConfig, type CinderblockConfig } from "./loadConfig.ts";
import { compileCinderblock, type BinaryData } from "@cinderblock-lang/legacy-compiler";

export class Project {
  readonly #data: BinaryData;
  readonly #root: string;
  readonly #config: CinderblockConfig;

  constructor(baseDir: string) {
    const config = loadConfig(baseDir);

    this.#data = compileCinderblock(
      [baseDir, ...(config.lib_dirs?.map((l) => path.resolve(baseDir, l)) ?? [])].flatMap((root) =>
        fs
          .readdirSync(root, { recursive: true, encoding: "utf-8" })
          .filter((f) => f.endsWith(".cb"))
          .map((f) => [f, fs.readFileSync(path.resolve(root, f), "utf8")] as [string, string]),
      ),
    );
    this.#root = baseDir;
    this.#config = config;
  }

  async compile() {
    try {
      fs.mkdirSync(path.resolve(this.root, ".cinder"), { recursive: true });
    } catch {}

    const { data, metadata } = this.#data;
    fs.writeFileSync(path.resolve(this.root, ".cinder/app.block"), data);
    fs.writeFileSync(path.resolve(this.root, ".cinder/metadata.json"), JSON.stringify(metadata));

    try {
      fs.rmSync(path.resolve(this.root, ".cinder", "imports"), { recursive: true });
    } catch {}

    for (const root of this.#roots) {
      for (const file of fs.readdirSync(root, { recursive: true, encoding: "utf8" })) {
        if (!file.endsWith(".cb.ts")) continue;
        const filePath = path.resolve(root, file);

        await esbuild.build({
          entryPoints: [filePath],
          outfile: path.resolve(this.root, ".cinder", "imports", [crypto.randomUUID(), "js"].join(".")),
          format: "esm",
          bundle: true,
          minify: true,
        });
      }
    }

    if (this.#config.main) {
      await esbuild.build({
        entryPoints: [path.resolve(this.#root, this.#config.main)],
        outfile: path.resolve(this.root, ".cinder", "main.js"),
        format: "esm",
        bundle: true,
        minify: true,
      });
    }
  }

  get root() {
    return this.#root;
  }

  get #roots() {
    return [this.#root, ...(this.#config.lib_dirs?.map((l) => path.resolve(this.#root, l)) ?? [])];
  }

  get types() {
    return this.#data.types;
  }
}
