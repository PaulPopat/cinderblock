import { Closure, Namer, variablise, type Frame, type Variable } from "#runner";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";
import { Location } from "#utils";
import { TypePipeable } from "./TypePipeable.ts";
import { TokenStore } from "#tokeniser";
import { EntityReferenceable } from "./EntityReferenceable.ts";

export class EntityExternal extends EntityReferenceable {
  readonly #name: string;
  readonly #implementation: Function;
  readonly #internalName = Namer.Next;

  constructor(name: string, implementation: Function) {
    super(Location.empty, TokenStore.start([]), () => undefined);
    this.#name = name;
    this.#implementation = implementation;
  }

  get name() {
    return this.#name;
  }

  get internalName() {
    return this.#internalName;
  }

  get fullName() {
    return this.#name;
  }

  get namespace() {
    return this.#name;
  }

  get type() {
    return new TypePipeable(this.location, this.done, () => this, [], new TypePrimitiveUnknown(this.location, this.done, () => this));
  }

  async execute(_: Closure, args: Frame): Promise<Variable> {
    return variablise(await this.#implementation(args.export()));
  }
}
