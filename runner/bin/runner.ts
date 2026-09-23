#!/usr/bin/env node

import { CinderBlockBinary } from "#app";
import path from "node:path";

async function main() {
  const binary = await CinderBlockBinary.FromBinary(path.resolve("."));
  const [command, ...args] = process.argv.slice(2);
  binary.exec(command!, args);
}

void main();
