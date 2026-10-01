#!/usr/bin/env node

import { Project } from "#app";
import { CinderBlockBinary } from "@cinderblock-lang/runner";
import path from "node:path";

async function main() {
  const maindir = path.resolve(".");
  await new Project(maindir).compile();
  const [command, ...args] = process.argv.slice(2);

  if (command) {
    const binary = await CinderBlockBinary.FromBinary(maindir);
    await binary.exec(command, args);
  }
}

void main();
