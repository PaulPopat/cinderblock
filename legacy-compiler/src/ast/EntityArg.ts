import type { Entry } from "./Entry.ts";
import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { Type } from "./Type.ts";
import { TypeArg } from "./TypeArg.ts";
import { TokenTypeName } from "#tokeniser";
import { Entity } from "./Entity.ts";
import type { CreateFunc } from "#writer";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export class EntityArg extends Entity {
  readonly #type: Type;
  readonly #name: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ type, name }, done] = walker
      .text("name", TokenTypeName.ParameterName)
      .if(
        (s) => s.data === ":",
        (w) => w.expect(":", TokenTypeName.Punctuation).extract("type", (w) => Type.Parse(w, () => this)),
      )
      .finish();
    super(walker.location, done, parent);
    this.#type = type ?? new TypePrimitiveUnknown(walker.location, done, () => this);
    this.#name = name.startsWith('"') ? JSON.parse(name) : name;
  }

  type(invocationType: TypeTuple) {
    if (this.#type instanceof TypePrimitiveUnknown) {
      return invocationType.args.find((a) => a.name === this.#name)?.type ?? this.#type;
    }

    return this.#type;
  }

  get name() {
    return this.#name;
  }

  get typeArg() {
    return new TypeArg(this.location, this.done, () => this, this.#type, this.#name);
  }

  dig(name: string): Entry | undefined {
    if (name === this.#name) return this;

    return undefined;
  }

  float(name: string): Entry | undefined {
    return this.parent?.float(name);
  }

  model(): CreateFunc[] {
    return [];
  }
}
