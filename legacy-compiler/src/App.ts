import {
  Entity,
  EntityExternal,
  EntityLet,
  EntityNamespace,
  TypeArg,
  TypeArray,
  TypePipeable,
  TypePrimitiveBool,
  TypePrimitiveInt,
  TypePrimitiveLong,
  TypePrimitiveString,
  TypePrimitiveUnknown,
} from "#ast";
import { TokenWalker } from "#tokeniser";
import { Location } from "#utils";
import { serialiseApp } from "#writer";
import { CinderBlockBinary, type AppMetadata, type GlobalFunction } from "@cinderblock-lang/runner";

type BinaryData = {
  data: Buffer;
  metadata: AppMetadata;
};

const emptyStart = [Location.empty, TokenWalker.empty, () => undefined] as const;

export abstract class App extends EntityNamespace {
  constructor(entities: Array<Entity>) {
    super(Location.empty, TokenWalker.start([]), () => undefined, "App", [
      new EntityExternal(
        "std_app_tagged",
        new TypePipeable(
          ...emptyStart,
          [
            new TypeArg(...emptyStart, new TypePrimitiveString(...emptyStart), "_s"),
            new TypeArg(...emptyStart, new TypePrimitiveString(...emptyStart), "key"),
          ],
          new TypeArray(...emptyStart, new TypePipeable(...emptyStart, [], new TypePrimitiveUnknown(...emptyStart))),
        ),
      ),
      new EntityExternal(
        "std_array_map",
        new TypePipeable(
          ...emptyStart,
          [
            new TypeArg(...emptyStart, new TypeArray(...emptyStart, new TypePrimitiveUnknown(...emptyStart)), "_s"),
            new TypeArg(
              ...emptyStart,
              new TypePipeable(
                ...emptyStart,
                [
                  new TypeArg(...emptyStart, new TypePrimitiveUnknown(...emptyStart), "item"),
                  new TypeArg(...emptyStart, new TypePrimitiveInt(...emptyStart), "index"),
                ],
                new TypePrimitiveUnknown(...emptyStart),
              ),
              "selector",
            ),
          ],
          new TypeArray(...emptyStart, new TypePrimitiveUnknown(...emptyStart)),
        ),
      ),
      new EntityExternal(
        "std_array_reduce",
        new TypePipeable(
          ...emptyStart,
          [
            new TypeArg(...emptyStart, new TypeArray(...emptyStart, new TypePrimitiveUnknown(...emptyStart)), "_s"),
            new TypeArg(...emptyStart, new TypePrimitiveUnknown(...emptyStart), "initial"),
            new TypeArg(
              ...emptyStart,
              new TypePipeable(
                ...emptyStart,
                [
                  new TypeArg(...emptyStart, new TypePrimitiveUnknown(...emptyStart), "item"),
                  new TypeArg(...emptyStart, new TypePrimitiveUnknown(...emptyStart), "current"),
                  new TypeArg(...emptyStart, new TypePrimitiveInt(...emptyStart), "index"),
                ],
                new TypePrimitiveUnknown(...emptyStart),
              ),
              "reducer",
            ),
          ],
          new TypePrimitiveUnknown(...emptyStart),
        ),
      ),
      new EntityExternal(
        "std_array_find",
        new TypePipeable(
          ...emptyStart,
          [
            new TypeArg(...emptyStart, new TypeArray(...emptyStart, new TypePrimitiveUnknown(...emptyStart)), "_s"),
            new TypeArg(
              ...emptyStart,
              new TypePipeable(
                ...emptyStart,
                [
                  new TypeArg(...emptyStart, new TypePrimitiveUnknown(...emptyStart), "item"),
                  new TypeArg(...emptyStart, new TypePrimitiveInt(...emptyStart), "index"),
                ],
                new TypePrimitiveBool(...emptyStart),
              ),
              "predicate",
            ),
          ],
          new TypePrimitiveUnknown(...emptyStart),
        ),
      ),
      new EntityExternal(
        "std_array_filter",
        new TypePipeable(
          ...emptyStart,
          [
            new TypeArg(...emptyStart, new TypeArray(...emptyStart, new TypePrimitiveUnknown(...emptyStart)), "_s"),
            new TypeArg(
              ...emptyStart,
              new TypePipeable(
                ...emptyStart,
                [
                  new TypeArg(...emptyStart, new TypePrimitiveUnknown(...emptyStart), "item"),
                  new TypeArg(...emptyStart, new TypePrimitiveInt(...emptyStart), "index"),
                ],
                new TypePrimitiveBool(...emptyStart),
              ),
              "predicate",
            ),
          ],
          new TypeArray(...emptyStart, new TypePrimitiveUnknown(...emptyStart)),
        ),
      ),
      new EntityExternal(
        "std_array_some",
        new TypePipeable(
          ...emptyStart,
          [
            new TypeArg(...emptyStart, new TypeArray(...emptyStart, new TypePrimitiveUnknown(...emptyStart)), "_s"),
            new TypeArg(
              ...emptyStart,
              new TypePipeable(
                ...emptyStart,
                [
                  new TypeArg(...emptyStart, new TypePrimitiveUnknown(...emptyStart), "item"),
                  new TypeArg(...emptyStart, new TypePrimitiveInt(...emptyStart), "index"),
                ],
                new TypePrimitiveBool(...emptyStart),
              ),
              "predicate",
            ),
          ],
          new TypePrimitiveBool(...emptyStart),
        ),
      ),
      new EntityExternal(
        "std_array_join",
        new TypePipeable(
          ...emptyStart,
          [
            new TypeArg(...emptyStart, new TypeArray(...emptyStart, new TypePrimitiveUnknown(...emptyStart)), "_s"),
            new TypeArg(...emptyStart, new TypePrimitiveString(...emptyStart), "separator"),
          ],
          new TypePrimitiveString(...emptyStart),
        ),
      ),
      new EntityExternal(
        "std_array_get",
        new TypePipeable(
          ...emptyStart,
          [
            new TypeArg(...emptyStart, new TypeArray(...emptyStart, new TypePrimitiveUnknown(...emptyStart)), "_s"),
            new TypeArg(...emptyStart, new TypePrimitiveInt(...emptyStart), "i"),
          ],
          new TypePrimitiveUnknown(...emptyStart),
        ),
      ),
      new EntityExternal(
        "std_array_length",
        new TypePipeable(
          ...emptyStart,
          [new TypeArg(...emptyStart, new TypeArray(...emptyStart, new TypePrimitiveUnknown(...emptyStart)), "_s")],
          new TypePrimitiveInt(...emptyStart),
        ),
      ),
      new EntityExternal(
        "std_date_iso",
        new TypePipeable(
          ...emptyStart,
          [new TypeArg(...emptyStart, new TypePrimitiveLong(...emptyStart), "_s")],
          new TypePrimitiveString(...emptyStart),
        ),
      ),
      new EntityExternal(
        "std_string_split",
        new TypePipeable(
          ...emptyStart,
          [
            new TypeArg(...emptyStart, new TypePrimitiveString(...emptyStart), "_s"),
            new TypeArg(...emptyStart, new TypePrimitiveString(...emptyStart), "on"),
          ],
          new TypeArray(...emptyStart, new TypePrimitiveString(...emptyStart)),
        ),
      ),
      new EntityExternal(
        "std_string_matches",
        new TypePipeable(
          ...emptyStart,
          [
            new TypeArg(...emptyStart, new TypePrimitiveString(...emptyStart), "_s"),
            new TypeArg(...emptyStart, new TypePrimitiveString(...emptyStart), "pattern"),
          ],
          new TypePrimitiveBool(...emptyStart),
        ),
      ),
      new EntityExternal(
        "std_string_trim",
        new TypePipeable(
          ...emptyStart,
          [new TypeArg(...emptyStart, new TypePrimitiveString(...emptyStart), "_s")],
          new TypePrimitiveString(...emptyStart),
        ),
      ),
      ...entities,
    ]);
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

  binary(globals: Record<string, GlobalFunction> = {}) {
    const { data, metadata } = this.binaryData;
    return CinderBlockBinary.FromMemory(data, metadata, globals);
  }
}
