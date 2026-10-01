import { App, Entity, Tokeniser, TokenType, TokenWalker } from "@cinderblock-lang/legacy-compiler";
import { CinderBlockBinary } from "@cinderblock-lang/runner";

export class Inline extends App {
  readonly #types: Array<TokenType>;

  constructor(code: string) {
    const [{ entities }, done] = TokenWalker.start([])
      .with(new Tokeniser("inline", code).tokens)
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, () => this),
      )
      .finish();

    super(entities);
    this.#types = done.types;
  }

  get types() {
    return this.#types;
  }

  binary(globals: Record<string, unknown> = {}) {
    const { data, metadata } = this.binaryData;
    return CinderBlockBinary.FromMemory(data, metadata, globals);
  }
}
