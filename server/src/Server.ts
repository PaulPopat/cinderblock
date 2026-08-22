import { Project } from "@cinderblock/compiler";
import express, { type NextFunction, type Request, type Response } from "express";

export class Server extends Project {
  readonly #updaters: Record<string, unknown>;

  constructor(root: string, factories: Record<string, unknown>, updaters: Record<string, unknown>) {
    super(root, factories);

    this.#updaters = updaters;
  }

  async start() {
    const server = express();
    server.use(express.json());

    const handlers = this.withTag("type", "handler");

    for (const handler of handlers) {
      const method = handler.tags.find((t) => t.key === "method")?.value ?? "get";
      if (typeof method !== "string") throw new Error("Invalid method type");

      const path = handler.tags.find((t) => t.key === "path")?.value;
      if (typeof path !== "string") throw new Error("Invalid path");

      console.log(`Found handler for ${method}:${path}`);

      (server as any)[method.toLowerCase()](path, async (request: Request, response: Response, next: NextFunction) => {
        if (request.method.toUpperCase() !== method) return next();

        const result = await this.run(handler, {
          path: request.path,
          method: request.method,
          body: request.body,
          headers: request.headers,
          params: request.params,
          query: request.query,
          now: Date.now(),
        });

        const updates = "updates" in result ? result.updates : {};
        for (const [key, value] of Object.entries(updates)) {
          const updater = this.#updaters[key];
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
