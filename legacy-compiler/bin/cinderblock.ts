#!/usr/bin/env node

import { loadConfig, Project } from "#app";
import { CinderBlockBinary } from "@cinderblock-lang/runner";
import path from "node:path";

async function main() {
  const maindir = path.resolve(".");
  const config = await loadConfig(maindir);
  await new Project(maindir, config).compile();
  const [command, ...args] = process.argv.slice(2);

  if (command) {
    const binary = await CinderBlockBinary.FromBinary(maindir);
    await binary.exec(command, args);
  }
}

void main();
