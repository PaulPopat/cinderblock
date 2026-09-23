import CinderBlockRunner, { type MainModule } from "../CinderBlockRunner.js";
import fs from "node:fs/promises";
import path from "node:path";
import { extract, variablise, variabliseTuple } from "./variablise.ts";
import type { Variable } from "#variable";
import type { AppFunc, AppMetadata } from "./AppMetadata.ts";
import { parseRunCommand } from "#project";
import assert from "node:assert";

export class CinderBlockBinary {
  static async FromBinary(dir: string) {
    const cinder_dir = path.resolve(dir, ".cinder");
    const data = await fs.readFile(path.resolve(cinder_dir, "app.block"));
    const metadata: AppMetadata = JSON.parse(await fs.readFile(path.resolve(cinder_dir, "metadata.json"), "utf8"));

    let globals: Record<string, unknown> = {};
    try {
      globals = await (
        await fs.readdir(path.resolve(cinder_dir, "imports"), { encoding: "utf-8" })
      )
        .filter((f) => f.endsWith(".js"))
        .map((f) => import(path.resolve(cinder_dir, "imports", f)))
        .reduce((existing, imported) => existing.then((p) => imported.then((i) => ({ ...p, ...i }))), Promise.resolve({} as Record<string, any>));
    } catch {}

    let main: Function | undefined = undefined;
    try {
      main = await import(path.resolve(cinder_dir, "main.js")).then((m) => m.default);
    } catch {}

    return this.FromMemory(data, metadata, globals, main);
  }

  static FromMemory(data: Buffer, metadata: AppMetadata, globals: Record<string, unknown>, main?: Function) {
    return new CinderBlockBinary(
      (async () => {
        const module = await CinderBlockRunner();
        const report = module.LoadApp(data);
        if (!report.is_success) {
          throw new Error(`ERR! CinderBlock initialise failed with error ${report.error}`);
        }

        const globals_report = module.LoadGlobals([
          ...Object.entries(globals)
            .filter(([key]) => typeof key === "string")
            .map(([key_1, value_2]) => ({ name: key_1 as string, value: variablise(typeof value_2 === "function" ? value_2.bind(this) : value_2) })),
        ]);

        if (!globals_report.is_success) {
          throw new Error(`ERR! CinderBlock initialise failed with error ${globals_report.error}`);
        }

        return module;
      })(),
      metadata,
      main,
    );
  }

  readonly #module: Promise<MainModule>;
  readonly #metadata: AppMetadata;
  readonly #main: Function | undefined;

  private constructor(module: Promise<MainModule>, metadata: AppMetadata, main: Function | undefined) {
    this.#module = module;
    this.#metadata = metadata;
    this.#main = main;
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

  async exec(command: string, args: Array<string>) {
    switch (command) {
      case "run": {
        const { letName, parametersObject } = parseRunCommand(args);
        const result = await this.run(letName, parametersObject);
        console.log(JSON.stringify(result, undefined, 2));
      }
      case "app": {
        if (typeof this.#main !== "function") {
          throw new Error("Could not find main func");
        }

        this.#main.call(this);
      }
      case "test": {
        let totalTests = 0;
        let passingTests = 0;
        for (const test of this.withTag("test")) {
          totalTests += 1;
          const testName = test.tags.test!;
          try {
            const result = await this.run(test, {});
            if (typeof result !== "object" || !result || !("actual" in result) || !("expected" in result)) {
              console.log("Invalid response type");
              throw new Error();
            }

            assert.deepEqual(result.actual, result.expected);

            passingTests += 1;
            console.log(`${testName} - PASS`);
          } catch (err) {
            console.log(err);
            console.log(`${testName} - FAILED`);
          }
        }

        if (totalTests === passingTests) {
          console.log(`All ${totalTests} tests passed!`);
        } else {
          console.log(`${passingTests}/${totalTests} passed. See failing tests above.`);
          process.exit(1);
        }
      }
    }
  }
}
