import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveDouble extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^double+$/gm,
      parse: (w) =>
        w.expect("double").finish(({}, ctx) => new TypePrimitiveDouble(ctx)),
    });
  }

  get name() {
    return "double";
  }
}
