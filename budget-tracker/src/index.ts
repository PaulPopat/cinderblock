import { Server } from "@cinderblock/server";
import path from "node:path";
import * as factories from "./factories/index.ts";
import * as updaters from "./updaters/index.ts";

const server = new Server(path.resolve(import.meta.dirname), factories, updaters);

server.start();
