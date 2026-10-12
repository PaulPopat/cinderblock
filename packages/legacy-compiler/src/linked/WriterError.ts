import type { Range } from "#utils";
import { CompilerError } from "../utils/CompilerError.ts";

export class WriterError extends CompilerError {
  constructor(message: string, range: Range) {
    super(message, range);
  }
}
