import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveUnknown extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^unknown+$/gm,
      chainable: false,
      parse: (w) => w.expect("unknown").finish(({}, ctx) => new TypePrimitiveUnknown(ctx)),
    });
  }

  get name() {
    return "unknown";
  }
}
