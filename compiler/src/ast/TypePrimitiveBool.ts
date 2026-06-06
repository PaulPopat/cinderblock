import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveBool extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^bool+$/gm,
      chainable: false,
      parse: (w) =>
        w.expect("bool").finish(({}, ctx) => new TypePrimitiveBool(ctx)),
    });
  }

  get name() {
    return "bool";
  }
}
