import type { TokenStore } from "#tokeniser";
import { CompilerError } from "../utils/CompilerError.ts";

export class ParserError extends CompilerError {
  constructor(message: string, store: TokenStore) {
    super(message, store.location);
  }
}
