#!/usr/bin/env node

import { getGlobals, loadConfig, parseRunCommand, Project } from "#app";
import { CinderBlockBinary } from "@cinderblock-lang/runner";
import path from "node:path";
import assert from "node:assert";

async function main() {
  const config = await loadConfig(path.resolve("."));
  const dirs = [path.resolve("."), ...(config.lib_dirs ?? []).map((d) => path.resolve(d))];
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "compile": {
      new Project(...dirs).compile();
      break;
    }
    case "inline-run": {
      const { letName, parametersObject } = parseRunCommand(args);
      const binary = new Project(...dirs).binary(await getGlobals(dirs));
      const result = await binary.run(letName, parametersObject);
      console.log(JSON.stringify(result, undefined, 2));
    }
    case "run": {
      const { letName, parametersObject } = parseRunCommand(args);
      const binary = await CinderBlockBinary.FromBinary(path.resolve("."), await getGlobals(dirs));
      const result = await binary.run(letName, parametersObject);
      console.log(JSON.stringify(result, undefined, 2));
    }
    case "app": {
      if (!config.main) throw new Error("No main specified");
      const binary = await CinderBlockBinary.FromBinary(path.resolve("."), await getGlobals(dirs));

      const { default: mainFunc } = await import(config.main);
      if (typeof mainFunc !== "function") throw new Error("Could not find main func");
      mainFunc.call(binary);
    }
    case "inline-app": {
      if (!config.main) throw new Error("No main specified");
      const binary = new Project(...dirs).binary(await getGlobals(dirs));

      const { default: mainFunc } = await import(config.main);
      if (typeof mainFunc !== "function") throw new Error("Could not find main func");
      mainFunc.call(binary);
    }
    case "test": {
      const binary = new Project(...dirs).binary(await getGlobals(dirs));
      let totalTests = 0;
      let passingTests = 0;
      for (const test of binary.withTag("test")) {
        totalTests += 1;
        const testName = test.tags.test!;
        try {
          const result = await binary.run(test, {});
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

void main();
