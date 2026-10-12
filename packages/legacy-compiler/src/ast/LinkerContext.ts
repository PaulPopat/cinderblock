export class LinkerContext<TResult extends Record<string, unknown> = Record<never, unknown>> {
  static get Empty() {
    return new LinkerContext({}, {});
  }

  static From(searchable: Record<string, unknown>) {
    return new LinkerContext(searchable, {});
  }

  readonly #searchable: Record<string, unknown>;
  readonly #result: TResult;

  private constructor(searchable: Record<string, unknown>, result: TResult) {
    this.#searchable = searchable;
    this.#result = result;
  }

  search(name: string) {
    return this.#searchable[name];
  }

  searchable(name: string, result: (ctx: this) => [LinkerContext, unknown]) {
    const [ctx, entry] = result(this);
    return new LinkerContext({ ...this.#searchable, ...ctx.#searchable, [name]: entry }, this.#result);
  }

  with<TKey extends string, TEntry>(name: TKey, result: (ctx: this) => [LinkerContext, TEntry]) {
    const [ctx, entry] = result(this);
    return new LinkerContext(
      {
        ...this.#searchable,
        ...ctx.#searchable,
      },
      {
        ...this.#result,
        [name]: entry,
      } as TResult & { [key in TKey]: TEntry },
    );
  }

  mapWith<TSubject, TKey extends string, TEntry extends unknown>(
    input: Array<TSubject>,
    name: TKey,
    result: (ctx: this, item: TSubject) => [LinkerContext, TEntry],
  ) {
    let final: LinkerContext = this;
    const res: Array<TEntry> = [];
    for (const item of input) {
      const [ctx, entry] = result(this, item);
      final = new LinkerContext({ ...final.#searchable, ...ctx.#searchable }, final.#result);
      res.push(entry);
    }

    return new LinkerContext(
      {
        ...this.#searchable,
        ...final.#searchable,
      },
      {
        ...this.#result,
        [name]: res,
      } as TResult & { [key in TKey]: Array<TEntry> },
    );
  }

  break<TKey extends string, TEntry extends unknown>(name: TKey, result: (ctx: this) => [LinkerContext, TEntry]) {
    const [ctx, entry] = result(this);
    return new LinkerContext(this.#searchable, {
      ...this.#result,
      [name]: entry,
    } as TResult & { [key in TKey]: TEntry });
  }

  finish<T>(handler: (ctx: TResult) => T): [LinkerContext, T] {
    return [this, handler(this.#result)];
  }
}
