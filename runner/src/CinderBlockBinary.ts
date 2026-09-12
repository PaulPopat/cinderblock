import CinderBlockRunner, { type MainModule } from "../CinderBlockRunner.js";
import fs from "node:fs/promises";
import path from "node:path";
import { extract, variablise, variabliseTuple } from "./variablise.ts";
import type { Variable } from "#variable";
import type { AppMetadata } from "./AppMetadata.ts";

export class CinderBlockBinary {
  static async FromBinary(dir: string, globals: Record<string, unknown>) {
    const data = await fs.readFile(path.resolve(dir, "app.block"));
    const names = JSON.parse(await fs.readFile(path.resolve(dir, "metadata.json"), "utf8"));
    return this.FromMemory(data, names, globals);
  }

  static FromMemory(data: Buffer, metadata: AppMetadata, globals: Record<string, unknown>) {
    const module = CinderBlockRunner().then((m) => {
      m.LoadApp(data);
      m.LoadGlobals(
        Object.entries(globals)
          .filter(([key]) => typeof key === "string")
          .map(([key, value]) => ({ name: key as string, value: variablise(value) })),
      );

      return m;
    });

    return new CinderBlockBinary(module, metadata);
  }

  readonly #module: MainModule | Promise<MainModule>;
  readonly #metadata: AppMetadata;

  constructor(module: MainModule | Promise<MainModule>, metadata: AppMetadata) {
    this.#module = module;
    this.#metadata = metadata;
  }

  async run(letName: string, args: Record<string, unknown>) {
    const module = await this.#module;
    const target = this.#metadata.funcs[["App", letName].join("_")];
    if (!target) throw new Error(`Could not find name ${letName}`);
    return extract(module.Run(target.id, variabliseTuple(args)) as Variable);
  }

  withTag(key: string, value: string) {
    return Object.entries(this.#metadata.funcs)
      .filter(([, funcMetadat]) => funcMetadat.tags.find((t) => t.key === key && t.value === value))
      .map(([funcName]) => funcName);
  }
}
