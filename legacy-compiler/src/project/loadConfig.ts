import fs from "node:fs";
import path from "node:path";

export type CinderblockConfig = {
  main?: string;
  lib_dirs?: Array<string>;
};

export function loadConfig(dir: string) {
  let config: CinderblockConfig = {};
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(dir, "package.json"), "utf8"));
    if ("cinderblock" in packageJson) {
      config = packageJson.cinderblock;
    }
  } catch {}

  return config;
}
