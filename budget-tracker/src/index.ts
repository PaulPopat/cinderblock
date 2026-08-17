import { Server } from "@cinderblock/server";
import path from "node:path";

const server = new Server(path.resolve(import.meta.dirname));

server.start();
