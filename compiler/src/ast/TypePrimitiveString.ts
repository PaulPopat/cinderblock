import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveString extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^string+$/gm,
      parse: (w) =>
        w.expect("string").finish(({}, ctx) => new TypePrimitiveString(ctx)),
    });
  }

  get name() {
    return "string";
  }
}
