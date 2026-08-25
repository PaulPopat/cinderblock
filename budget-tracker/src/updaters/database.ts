import { database } from "#integration/database";
import type { SQLInputValue } from "node:sqlite";

type DatabaseQueryProps = {
  sql: string;
  parameters: Array<SQLInputValue>;
};

export function database_execute(props: DatabaseQueryProps) {
  return database.prepare(props.sql).run(...props.parameters);
}
