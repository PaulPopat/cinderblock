import { Entity, EntityLet, EntityNamespace } from "#ast";
import { TokenWalker } from "#tokeniser";
import { Location } from "#utils";
import { serialiseApp } from "#writer";
import { CinderBlockBinary, type AppMetadata } from "@cinderblock-lang/runner";

type BinaryData = {
  data: Buffer;
  metadata: AppMetadata;
};

export abstract class App extends EntityNamespace {
  constructor(entities: Array<Entity>) {
    super(Location.empty, TokenWalker.start([]), () => undefined, "App", entities);
  }

  get binaryData(): BinaryData {
    return {
      data: serialiseApp(this.topLevelEntities.flatMap((e) => e.model)),
      metadata: {
        funcs: Object.fromEntries(
          this.entities
            .filter((e) => e instanceof EntityLet)
            .map((e) => [
              e.fullName,
              {
                id: e.internalName,
                tags: e.tags.map((t) => ({ key: t.key, value: t.value?.toString() ?? "" })),
              },
            ]),
        ),
      },
    };
  }

  binary(globals: Record<string, unknown> = {}) {
    const { data, metadata } = this.binaryData;
    return CinderBlockBinary.FromMemory(data, metadata, globals);
  }
}
