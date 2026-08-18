import { DatabaseSync, type SQLInputValue } from "node:sqlite";

const database = new DatabaseSync(process.env.DATABASE_LOCATION ?? ":memory:");

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

export default {
  query(query: TemplateStringsArray, ...args: Array<SQLInputValue>) {
    return database.prepare(query.join("?")).all(...args);
  },
  run(query: TemplateStringsArray, ...args: Array<SQLInputValue>) {
    database.prepare(query.join("?")).run(...args);
  },
};
