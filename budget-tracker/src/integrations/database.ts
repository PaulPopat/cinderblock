import { DatabaseSync, type SQLInputValue } from "node:sqlite";

export const database = new DatabaseSync(process.env.DATABASE_LOCATION ?? ":memory:");

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

database.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

database.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY,
    user TEXT NOT NULL REFERENCES users(id) ON UPDATE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE,
    amount INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);
