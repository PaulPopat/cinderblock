import fs from "node:fs";
import path from "node:path";

export function getGlobals(roots: Array<string>, base?: Record<string, unknown>) {
  return roots
    .flatMap((root) =>
      fs
        .readdirSync(root, { recursive: true, encoding: "utf-8" })
        .filter((f) => f.endsWith(".cb.ts"))
        .map((f) => import(path.resolve(root, f)))
        .reduce((existing, imported) => existing.then((p) => imported.then((i) => ({ ...p, ...i }))), Promise.resolve({} as Record<string, any>)),
    )
    .reduce((existing, imported) => existing.then((p) => imported.then((i) => ({ ...p, ...i }))), Promise.resolve(base ?? {}));
}
