#!/usr/bin/env node

import { getGlobals, loadConfig, parseRunCommand, Project } from "#app";
import { CinderBlockBinary } from "@cinderblock-lang/runner";
import path from "node:path";

async function main() {
  const config = await loadConfig(path.resolve("."));
  const dirs = [path.resolve("."), ...(config.lib_dirs ?? []).map((d) => path.resolve(d))];
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "compile": {
      new Project(...dirs).compile();
      break;
    }
    case "inline": {
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
    case "test": {
      const binary = new Project(...dirs).binary(await getGlobals(dirs));
      let totalTests = 0;
      let passingTests = 0;
      for (const test of binary.withTag("test")) {
        totalTests += 1;
        const testName = test.tags.test!;
        const result = await binary.run(test.name, {});
        if (result) {
          passingTests += 1;
          console.log(`${testName} - PASS`);
        } else {
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
