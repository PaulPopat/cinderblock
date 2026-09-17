import fs from "node:fs/promises";
import path from "node:path";
type CinderblockConfig = {
  lib_dirs?: Array<string>;
};

export async function loadConfig(dir: string) {
  let config: CinderblockConfig = {};
  try {
    const packageJson = JSON.parse(await fs.readFile(path.resolve(dir, "package.json"), "utf8"));
    if ("cinderblock" in packageJson) {
      config = packageJson.cinderblock;
    }
  } catch {}

  return config;
}
