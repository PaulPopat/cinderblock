import { Location, Range } from "#utils";
import type { Entry } from "../ast/Entry.ts";
import { ParserError } from "../ast/ParserError.ts";
import type { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";
import type { TokenTypeName } from "./TokenTypeName.ts";

export class TokenWalker<TContext extends Record<never, never> = Record<never, never>> {
  static start(tokens: Array<Token>) {
    return new TokenWalker({}, tokens, [], 0);
  }

  readonly #data: TContext;
  readonly #tokens: Array<Token>;
  readonly #types: Array<TokenType>;
  readonly #index: number;

  private constructor(data: TContext, tokens: Array<Token>, types: Array<TokenType>, index: number) {
    this.#data = data;
    this.#tokens = tokens;
    this.#types = types;
    this.#index = index;
  }

  get current() {
    const current = this.#tokens[this.#index];
    if (!current) throw new Error("At the end of the file");
    return current;
  }

  get data() {
    return this.current.data;
  }

  get done() {
    return this.#tokens.length <= this.#index;
  }

  get types() {
    return [...this.#types];
  }

  get previous() {
    return new TokenWalker(this.#data, this.#tokens, this.#types, this.#index - 1);
  }

  get range() {
    const current = this.#tokens[this.#index];
    if (!current) return new Range(Location.empty, Location.empty);
    return current.range;
  }

  get location() {
    return this.range.from;
  }

  expect(expected: Array<string> | string, typeName: TokenTypeName, self?: () => unknown) {
    if (typeof expected === "string") expected = [expected];
    if (!expected.includes(this.data)) {
      throw new ParserError(`Expected ${expected.join(", ")} but found ${this.data}`, this);
    }

    return new TokenWalker(this.#data, this.#tokens, [...this.#types, new TokenType(this.range, self, typeName)], this.#index + 1);
  }

  extract<TKey extends string, TResult extends Entry>(name: TKey, extractor: (walker: TokenWalker, soFar: TContext) => TResult) {
    type NewContext = TContext & {
      [key in TKey]: TResult;
    };
    const result = extractor(new TokenWalker({}, this.#tokens, this.#types, this.#index), this.#data);

    return new TokenWalker<NewContext>({ ...this.#data, [name]: result } as NewContext, result.done.#tokens, result.done.#types, result.done.#index);
  }

  if<TResult extends Record<never, never>>(
    predicate: (store: TokenWalker) => boolean,
    extractor: (walker: TokenWalker<TContext>) => TokenWalker<TContext & TResult>,
  ): TokenWalker<TContext & Partial<TResult>> {
    if (!predicate(this)) return this;
    return extractor(this);
  }

  text<TKey extends string>(name: TKey, typeName: TokenTypeName, self?: () => unknown) {
    type NewContext = TContext & {
      [key in TKey]: string;
    };
    return new TokenWalker<NewContext>(
      {
        ...this.#data,
        [name]: this.data,
      } as NewContext,
      this.#tokens,
      [...this.#types, new TokenType(this.range, self, typeName)],
      this.#index + 1,
    );
  }

  while<TKey extends string, TResult extends Entry, TWhile>(
    name: TKey,
    predicate: (store: TokenWalker) => TWhile,
    extractor: (store: TokenWalker, whileResult: TWhile) => TResult,
  ) {
    type NewContext = TContext & { [key in TKey]: Array<TResult> };
    let result: Array<TResult> = [];
    let whileResult: TWhile;
    let newStore: TokenWalker = this;

    while (!newStore.done && (whileResult = predicate(newStore))) {
      const baseExtract = extractor(new TokenWalker({}, newStore.#tokens, newStore.#types, newStore.#index), whileResult);
      result = [...result, baseExtract];
      newStore = baseExtract.done;
    }

    return new TokenWalker<NewContext>({ ...this.#data, [name]: result } as NewContext, newStore.#tokens, newStore.#types, newStore.#index);
  }

  reduce<TKey extends string, TResult extends Entry, TWhile>(
    name: TKey,
    predicate: (store: TokenWalker, previous?: TResult) => TWhile,
    extractor: (store: TokenWalker, whileResult: TWhile, previous?: TResult) => TResult,
    previous?: TResult,
  ) {
    type NewContext = TContext & { [key in TKey]: TResult };
    let result: TResult | undefined = previous;
    let whileResult: TWhile;
    let newStore: TokenWalker = this;

    while (!newStore.done && (whileResult = predicate(newStore, result))) {
      result = extractor(new TokenWalker({}, newStore.#tokens, newStore.#types, newStore.#index), whileResult, result);
      newStore = result.done;
    }

    return new TokenWalker<NewContext>({ ...this.#data, [name]: result } as NewContext, newStore.#tokens, newStore.#types, newStore.#index);
  }

  finish() {
    return [this.#data, this] as const;
  }

  with(tokens: Array<Token>) {
    return new TokenWalker(this.#data, [...this.#tokens, ...tokens], this.#types, this.#index);
  }
}
