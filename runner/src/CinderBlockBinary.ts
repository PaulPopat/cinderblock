import CinderBlockRunner, { type MainModule } from "../CinderBlockRunner.js";
import fs from "node:fs/promises";
import path from "node:path";
import { extract, variablise, variabliseTuple } from "./variablise.ts";
import type { Variable } from "#variable";
import type { AppFunc, AppMetadata } from "./AppMetadata.ts";

export class CinderBlockBinary {
  static async FromBinary(dir: string, globals: Record<string, unknown>) {
    const data = await fs.readFile(path.resolve(dir, ".cinder", "app.block"));
    const names = JSON.parse(await fs.readFile(path.resolve(dir, ".cinder", "metadata.json"), "utf8"));
    return this.FromMemory(data, names, globals);
  }

  static FromMemory(data: Buffer, metadata: AppMetadata, globals: Record<string, unknown> | Promise<Record<string, unknown>>) {
    const module = CinderBlockRunner().then(async (m) => {
      const report = m.LoadApp(data);
      if (!report.is_success) {
        throw new Error(`ERR! CinderBlock initialise failed with error ${report.error}`);
      }

      return m;
    });

    return new CinderBlockBinary(module, metadata, globals);
  }

  readonly #module: Promise<MainModule>;
  readonly #metadata: AppMetadata;

  constructor(module: MainModule | Promise<MainModule>, metadata: AppMetadata, globals: Record<string, unknown> | Promise<Record<string, unknown>>) {
    this.#module = Promise.resolve(module).then(async (m) => {
      const g = await Promise.resolve(globals);

      const report = m.LoadGlobals([
        ...Object.entries(g)
          .filter(([key]) => typeof key === "string")
          .map(([key_1, value_2]) => ({ name: key_1 as string, value: variablise(typeof value_2 === "function" ? value_2.bind(this) : value_2) })),
      ]);

      if (!report.is_success) {
        throw new Error(`ERR! CinderBlock initialise failed with error ${report.error}`);
      }

      return m;
    });
    this.#metadata = metadata;
  }

  async run(letName: string | AppFunc, args: Record<string, unknown>) {
    const module = await this.#module;
    const target = typeof letName === "object" ? letName.id : this.#metadata.funcs[["App", letName].join("_")]?.id;
    if (!target) {
      throw new Error(`Could not find name ${letName}`);
    }
    const response = await module.Run(target, variabliseTuple(args));
    if (response.is_success) {
      return extract(response.data as Variable);
    }

    throw new Error(`ERR! CinderBlock run failed with error ${response.error}`);
  }

  withTag(key: string) {
    return Object.entries(this.#metadata.funcs)
      .filter(([, funcMetadata]) => funcMetadata.tags.find((t) => t.key === key))
      .map(([funcName, funcMetadata]) => ({
        ...funcMetadata,
        name: funcName.replace("App_", ""),
        tags: Object.fromEntries(funcMetadata.tags.map((t) => [t.key, t.value])),
      }));
  }

  withTagOf(key: string, value: string) {
    return Object.entries(this.#metadata.funcs)
      .filter(([, funcMetadata]) => funcMetadata.tags.find((t) => t.key === key && t.value === value))
      .map(([funcName, funcMetadata]) => ({
        ...funcMetadata,
        name: funcName.replace("App_", ""),
        tags: Object.fromEntries(funcMetadata.tags.map((t) => [t.key, t.value])),
      }));
  }
}
