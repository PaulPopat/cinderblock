import { Entity, EntityLet, EntityNamespace, LinkerContext } from "#ast";
import { Tokeniser, TokenType, TokenWalker } from "#tokeniser";
import { serialiseApp } from "#writer";
import type { AppMetadata } from "@cinderblock-lang/sosso-runtime";
import { App } from "./App.ts";

export type BinaryData = {
  data: Buffer;
  metadata: AppMetadata;
  types: Array<TokenType>;
};

export function compileCinderblock(data: Array<[string, string]>): BinaryData {
  const [{ entities }, done] = TokenWalker.start(data.flatMap(([path, text]) => new Tokeniser(path, text).tokens))
    .while(
      "entities",
      (s) => Entity.HasParser(s),
      (w) => Entity.Parse(w, ""),
    )
    .finish();

  const app = new App(entities);
  const exported = app.public;

  return {
    data: serialiseApp(exported.map((e) => e.linked(undefined, LinkerContext.Empty(app, e.name))).map(([, e]) => e.func)),
    metadata: {
      funcs: Object.fromEntries(
        exported
          .filter((e) => e instanceof EntityLet)
          .map((e) => [
            e.fullname,
            {
              id: e.internalName,
              tags: e.tags.map((t) => ({ key: t.key, value: t.value?.toString() ?? "" })),
              location: {
                file: e.location.file,
                line: e.location.line,
                character: e.location.character,
              },
            },
          ]),
      ),
    },
    types: done.types,
  };
}
