import { Project } from "@cinderblock/compiler";
import express from "express";
import { Lazy } from "./Lazy.ts";
import fs from "node:fs/promises";
import path from "node:path";

export class Server extends Project {
  readonly #factories = new Lazy(async () => {
    const base = "./src/factories";
    const entries = await fs.readdir(base);

    let result: Record<string, unknown> = {};
    for (const entry of entries) {
      if (!entry.endsWith(".js") && !entry.endsWith(".ts")) continue;
      result = {
        ...result,
        ...(await import(path.resolve(base, entry))),
      };
    }

    return result;
  });

  readonly #updaters = new Lazy(async () => {
    const base = "./src/updaters";
    const entries = await fs.readdir(base);

    let result: Record<string, unknown> = {};
    for (const entry of entries) {
      if (!entry.endsWith(".js") && !entry.endsWith(".ts")) continue;
      result = {
        ...result,
        ...(await import(path.resolve(base, entry))),
      };
    }

    return result;
  });

  start() {
    const server = express();
    server.use(express.json());

    const handlers = this.app.withTag("type", "handler");

    for (const handler of handlers) {
      const method = handler.tags.find((t) => t.key === "method")?.value ?? "get";
      if (typeof method !== "string") throw new Error("Invalid method type");

      const path = handler.tags.find((t) => t.key === "path");
      if (typeof path !== "string") throw new Error("Invalid path");

      server.use(path, async (request, response, next) => {
        if (request.method.toLowerCase() !== method) return next();

        const result = await handler.invoke({
          ...(await this.#factories.value),
          request: {
            path: request.path,
            method: request.method,
            body: request.body,
            headers: request.headers,
          },
        });

        const updates = "updates" in result ? result.updates : {};
        const updaters = await this.#updaters.value;
        for (const [key, value] of Object.entries(updates)) {
          const updater = updaters[key];
          if (typeof updater !== "function") throw new Error("No updater found");

          for (const item of Array.isArray(value) ? value : [value]) {
            await updater(item);
          }
        }

        const { status, headers, body } = "updates" in result ? result.response : result;
        response.status(status);

        for (const [key, value] of Object.entries(headers ?? {})) {
          response.setHeader(key, value as string);
        }

        response.send(body);
      });
    }

    server.listen(8080, () => console.log("Server listening on port 8080"));
  }
}
