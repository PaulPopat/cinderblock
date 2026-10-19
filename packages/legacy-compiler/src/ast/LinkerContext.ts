import type { Range } from "#utils";
import { BoundEntry } from "./BoundEntry.ts";
import type { EntityNamespace } from "./EntityNamespace.ts";
import { LinkerError } from "./LinkerError.ts";

export class LinkerContext<TResult extends Record<string, unknown> = Record<never, unknown>> {
  static Empty(base: EntityNamespace, startName: string) {
    return new LinkerContext(base, startName, {}, {});
  }

  readonly #base: EntityNamespace;
  readonly #namespace: string;
  readonly #searchable: Record<string, unknown>;
  readonly #result: TResult;

  private constructor(base: EntityNamespace, namespace: string, searchable: Record<string, unknown>, result: TResult) {
    this.#base = base;
    this.#namespace = namespace;
    this.#searchable = searchable;
    this.#result = result;
  }

  get base() {
    return this.#base;
  }

  get closure() {
    return { ...this.#searchable };
  }

  search(name: string, from: Range) {
    if (this.#searchable[name]) {
      return this.#searchable[name];
    }

    const found = this.#base.search(name, this);
    if (found.length > 1) {
      throw new LinkerError("Ambiguous reference", from);
    }

    const item = found[0];
    if (!item) {
      throw new LinkerError("Reference not found", from);
    }

    return new BoundEntry(new LinkerContext(this.#base, this.#base.name, {}, {}), item);
  }

  searchable(name: string, result: (ctx: this) => [LinkerContext, unknown]) {
    const [ctx, entry] = result(this);
    return new LinkerContext(this.#base, "", { ...this.#searchable, ...ctx.#searchable, [name]: entry }, this.#result);
  }

  with<TKey extends string, TEntry>(name: TKey, result: (ctx: this, existing: TResult) => [LinkerContext, TEntry]) {
    const [ctx, entry] = result(this, this.#result);
    return new LinkerContext(
      this.#base,
      this.#namespace,
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
    result: (ctx: this, item: TSubject, existing: TResult) => [LinkerContext, TEntry],
  ) {
    let final: LinkerContext = this;
    const res: Array<TEntry> = [];
    for (const item of input) {
      const [ctx, entry] = result(this, item, this.#result);
      final = new LinkerContext(this.#base, this.#namespace, { ...final.#searchable, ...ctx.#searchable }, final.#result);
      res.push(entry);
    }

    return new LinkerContext(
      this.#base,
      this.#namespace,
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
    return new LinkerContext(this.#base, this.#namespace, this.#searchable, {
      ...this.#result,
      [name]: entry,
    } as TResult & { [key in TKey]: TEntry });
  }

  finish<T>(handler: (ctx: TResult) => T): [LinkerContext, T] {
    return [new LinkerContext(this.#base, this.#namespace, this.#searchable, {}), handler(this.#result)];
  }

  finishSearchable<T>(name: string, handler: (ctx: TResult) => T): [LinkerContext, T] {
    const final = handler(this.#result);
    return [new LinkerContext(this.#base, this.#namespace, this.#searchable, {}).searchable(name, (c) => [c, final]), final];
  }
}
