import { Project } from "@cinderblock/compiler";
import express, { type NextFunction, type Request, type Response } from "express";
import path from "node:path";
import cookieParser from "cookie-parser";

export class Server extends Project {
  readonly #factories: Record<string, unknown>;
  readonly #updaters: Record<string, unknown>;

  constructor(root: string, factories: Record<string, unknown>, updaters: Record<string, unknown>) {
    super(root);
    this.#factories = factories;
    this.#updaters = updaters;
  }

  async start() {
    const binary = this.binary(this.#factories);
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded());
    server.use(cookieParser());
    server.use("/_", express.static(path.resolve(this.root, "_")));

    for (const middleware of binary.withTag("type", "middleware")) {
      const location = middleware.tags.path;
      if (typeof location !== "string") throw new Error("Invalid path");

      console.log(`Found handler for MIDDLEWARE:${location}`);

      server.use(location, async (request: Request, response: Response, next: NextFunction) => {
        try {
          console.log(`MIDDLEWARE:${location} Starting`);

          const result = await binary.runFromModel(middleware, {
            path: request.path,
            method: request.method,
            body: request.body,
            headers: request.headers,
            params: request.params,
            query: request.query,
            now: Date.now(),
            cookies: request.cookies,
          });

          (request as any).ctx = result;
          next();
        } catch (err) {
          if (process.env.NODE_ENV === "production" || !(err instanceof Error)) {
            response.status(500).send("Internal server error");
          } else {
            response.status(500).send(`<style>code {white-space: pre-wrap}</style><code>${err.stack}</code>`);
          }
        }

        console.log(`MIDDLEWARE:${location} Finished`);
      });
    }

    for (const handler of binary.withTag("type", "handler")) {
      const method = handler.tags.method ?? "get";
      if (typeof method !== "string") throw new Error("Invalid method type");

      const handlerPath = handler.tags.path;
      if (typeof handlerPath !== "string") throw new Error("Invalid path");

      console.log(`Found handler for ${method}:${handlerPath}`);

      (server as any)[method.toLowerCase()](handlerPath, async (request: Request, response: Response, next: NextFunction) => {
        try {
          if (request.method.toUpperCase() !== method) return next();

          console.log(`${request.method}:${handlerPath} Starting`);

          const result = await binary.runFromModel(handler, {
            path: request.path,
            method: request.method,
            body: request.body,
            headers: request.headers,
            params: request.params,
            query: request.query,
            now: Date.now(),
            cookies: request.cookies,
            context: (request as any).ctx,
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
        } catch (err) {
          if (process.env.NODE_ENV === "production" || !(err instanceof Error)) {
            response.status(500).send("Internal server error");
          } else {
            response.status(500).send(`<style>code {white-space: pre-wrap}</style><code>${err.stack}</code>`);
          }
        }

        console.log(`${request.method}:${handlerPath} Finished`);
      });
    }

    server.listen(8080, () => console.log("Server listening on port 8080"));
  }
}
