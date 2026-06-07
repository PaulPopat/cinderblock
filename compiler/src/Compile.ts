import { EntityLet, Expression, TokenWalker } from "#ast";
import { Binary } from "#intermediary";
import { Tokeniser, TokenStore } from "#tokeniser";

export function Compile(...files: Array<[string, string]>) {
  const store = files.reduce(
    (store, [key, value]) => store.with(new Tokeniser(key, value).tokens),
    TokenStore.start([]),
  );

  const [expression] = Expression.Parse(TokenWalker.start(store));

  const ast = expression.entities
    .filter((e) => e instanceof EntityLet)
    .reduce((binary, entity) => entity.write(binary), new Binary([]));
}
