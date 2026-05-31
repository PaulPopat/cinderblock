import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";
import type { EntryContext } from "./EntryContext.ts";
import type { Extracted } from "./Extracted.ts";
import { ParserError } from "./ParserError.ts";

export class TokenWalker<
  TContext extends Record<never, never> = Record<never, never>,
> {
  static start(store: TokenStore) {
    return new TokenWalker({}, store, store.location, [[]], undefined);
  }

  readonly #data: TContext;
  readonly #store: TokenStore;
  readonly #start: Location;
  readonly #entities: Array<Array<Entry>>;
  readonly #namespace: string | undefined;

  private constructor(
    data: TContext,
    store: TokenStore,
    start: Location,
    entities: Array<Array<Entry>>,
    namespace: string | undefined,
  ) {
    this.#data = data;
    this.#store = store;
    this.#start = start;
    this.#entities = entities;
    this.#namespace = namespace;
  }

  get next() {
    return new TokenWalker(
      this.#data,
      this.#store.next,
      this.#start,
      this.#entities,
      this.#namespace,
    );
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
      throw new ParserError(
        `Expected ${expected} but found ${this.#store.data}`,
        this.#store,
      );
    }

    return new TokenWalker(
      this.#data,
      this.#store.next,
      this.#start,
      this.#entities,
      this.#namespace,
    );
  }

  extract<TKey extends string, TResult extends Entry>(
    name: TKey,
    extractor: (walker: TokenWalker) => Extracted<TResult>,
    mode: "part" | "entity" = "part",
  ) {
    type NewContext = TContext & {
      [key in TKey]: TResult;
    };
    const [result, newStore] = extractor(
      new TokenWalker(
        {},
        this.#store,
        this.#store.location,
        mode === "entity" ? [[], ...this.#entities] : this.#entities,
        this.#namespace,
      ),
    );

    return new TokenWalker<NewContext>(
      { ...this.#data, [name]: result } as NewContext,
      newStore,
      this.#start,
      mode === "entity"
        ? [[result, ...(this.#entities[0] ?? [])], ...this.#entities.slice(1)]
        : this.#entities,
      this.#namespace,
    );
  }

  if<TResult extends Record<never, never>>(
    predicate: (store: TokenStore) => boolean,
    extractor: (
      walker: TokenWalker<TContext>,
    ) => TokenWalker<TContext & TResult>,
  ): TokenWalker<TContext & Partial<TResult>> {
    if (!predicate(this.#store)) return this;
    return extractor(this);
  }

  text<TKey extends string>(
    name: TKey,
    mode: "namespace" | undefined = undefined,
  ) {
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
      this.#entities,
      mode === "namespace"
        ? [this.#namespace, this.data]
            .filter((n) => typeof n === "string")
            .join(":")
        : this.#namespace,
    );
  }

  while<TKey extends string, TResult extends Entry, TWhile>(
    name: TKey,
    predicate: (store: TokenStore) => TWhile,
    extractor: (store: TokenWalker, whileResult: TWhile) => Extracted<TResult>,
    mode: "part" | "entity" = "part",
  ) {
    type NewContext = TContext & { [key in TKey]: Array<TResult> };
    let result: Array<TResult> = [];
    let whileResult: TWhile;
    let newStore: TokenStore = this.#store;

    while ((whileResult = predicate(newStore))) {
      const [baseExtract, nextStore] = extractor(
        new TokenWalker(
          {},
          newStore,
          newStore.location,
          mode === "entity" ? [[], result, ...this.#entities] : this.#entities,
          this.#namespace,
        ),
        whileResult,
      );
      result = [...result, baseExtract];
      newStore = nextStore;
    }

    return new TokenWalker<NewContext>(
      { ...this.#data, [name]: result } as NewContext,
      newStore,
      this.#start,
      mode === "entity"
        ? [
            [...result, ...(this.#entities[0] ?? [])],
            ...this.#entities.slice(1),
          ]
        : this.#entities,
      this.#namespace,
    );
  }

  reduce<TKey extends string, TResult extends Entry, TWhile>(
    name: TKey,
    predicate: (store: TokenStore, previous?: TResult) => TWhile,
    extractor: (
      store: TokenWalker,
      whileResult: TWhile,
      previous?: TResult,
    ) => Extracted<TResult>,
  ) {
    type NewContext = TContext & { [key in TKey]: TResult };
    let result: TResult | undefined = undefined;
    let whileResult: TWhile;
    let newStore: TokenStore = this.#store;

    while ((whileResult = predicate(newStore, result))) {
      [result, newStore] = extractor(
        new TokenWalker(
          {},
          newStore,
          newStore.location,
          this.#entities,
          this.#namespace,
        ),
        whileResult,
        result,
      );
    }

    return new TokenWalker<NewContext>(
      { ...this.#data, [name]: result } as NewContext,
      newStore,
      this.#start,
      this.#entities,
      this.#namespace,
    );
  }

  finish<TResult>(
    handler: (data: TContext, ctx: EntryContext) => TResult,
  ): Extracted<TResult> {
    return [
      handler(this.#data, {
        start: this.#start,
        end: this.#store.location,
        entities: this.#entities.flat(),
        namespace: this.#namespace,
      }),
      this.#store,
    ];
  }
}
