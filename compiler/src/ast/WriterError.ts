import type { Location } from "#utils";
import { CompilerError } from "../utils/CompilerError.ts";

export class WriterError extends CompilerError {
  constructor(message: string, location: Location) {
    super(message, location);
  }
}
