import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";

export class TokenWalker<TContext extends Record<never, never> = Record<never, never>> {
  static start(store: TokenStore) {
    return new TokenWalker({}, store, store.location);
  }

  readonly #data: TContext;
  readonly #store: TokenStore;
  readonly #start: Location;

  private constructor(data: TContext, store: TokenStore, start: Location) {
    this.#data = data;
    this.#store = store;
    this.#start = start;
  }

  get next() {
    return new TokenWalker(this.#data, this.#store.next, this.#start);
  }

  get location() {
    return this.#store.location;
  }

  get data() {
    return this.#store.data;
  }

  get store() {
    return this.#store;
  }

  expect(expected: string) {
    if (this.#store.data !== expected) {
      throw new ParserError(`Expected ${expected} but found ${this.#store.data}`, this.#store);
    }

    return new TokenWalker(this.#data, this.#store.next, this.#start);
  }

  extract<TKey extends string, TResult extends Entry>(name: TKey, extractor: (walker: TokenWalker, soFar: TContext) => TResult) {
    type NewContext = TContext & {
      [key in TKey]: TResult;
    };
    const result = extractor(new TokenWalker({}, this.#store, this.#store.location), this.#data);

    return new TokenWalker<NewContext>({ ...this.#data, [name]: result } as NewContext, result.done, this.#start);
  }

  if<TResult extends Record<never, never>>(
    predicate: (store: TokenStore) => boolean,
    extractor: (walker: TokenWalker<TContext>) => TokenWalker<TContext & TResult>,
  ): TokenWalker<TContext & Partial<TResult>> {
    if (!predicate(this.#store)) return this;
    return extractor(this);
  }

  text<TKey extends string>(name: TKey) {
    type NewContext = TContext & {
      [key in TKey]: string;
    };
    return new TokenWalker<NewContext>(
      {
        ...this.#data,
        [name]: this.data,
      } as NewContext,
      this.#store.next,
      this.#start,
    );
  }

  while<TKey extends string, TResult extends Entry, TWhile>(
    name: TKey,
    predicate: (store: TokenStore) => TWhile,
    extractor: (store: TokenWalker, whileResult: TWhile) => TResult,
  ) {
    type NewContext = TContext & { [key in TKey]: Array<TResult> };
    let result: Array<TResult> = [];
    let whileResult: TWhile;
    let newStore: TokenStore = this.#store;

    while (!newStore.done && (whileResult = predicate(newStore))) {
      const baseExtract = extractor(new TokenWalker({}, newStore, newStore.location), whileResult);
      result = [...result, baseExtract];
      newStore = baseExtract.done;
    }

    return new TokenWalker<NewContext>({ ...this.#data, [name]: result } as NewContext, newStore, this.#start);
  }

  reduce<TKey extends string, TResult extends Entry, TWhile>(
    name: TKey,
    predicate: (store: TokenStore, previous?: TResult) => TWhile,
    extractor: (store: TokenWalker, whileResult: TWhile, previous?: TResult) => TResult,
  ) {
    type NewContext = TContext & { [key in TKey]: TResult };
    let result: TResult | undefined = undefined;
    let whileResult: TWhile;
    let newStore: TokenStore = this.#store;

    while (!newStore.done && (whileResult = predicate(newStore, result))) {
      result = extractor(new TokenWalker({}, newStore, newStore.location), whileResult, result);
      newStore = result.done;
    }

    return new TokenWalker<NewContext>({ ...this.#data, [name]: result } as NewContext, newStore, this.#start);
  }

  finish() {
    return [this.#data, this.#store] as const;
  }
}
