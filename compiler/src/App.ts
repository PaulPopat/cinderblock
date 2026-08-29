import { Entity, EntityLet, EntityNamespace } from "#ast";
import { TokenWalker } from "#tokeniser";
import { Location } from "#utils";
import { Binary } from "#runner";

export abstract class App extends EntityNamespace {
  constructor(entities: Array<Entity>) {
    super(Location.empty, TokenWalker.start([]), () => undefined, "App", entities);
  }

  get binaryData() {
    return {
      data: this.topLevelEntities.flatMap((e) => e.model),
      names: Object.fromEntries(this.entities.filter((e) => e instanceof EntityLet).map((e) => [e.fullName, e.internalName])),
    };
  }

  binary(globals: Record<string, unknown> = {}) {
    const { data, names } = this.binaryData;
    return new Binary(data, names, globals);
  }
}
