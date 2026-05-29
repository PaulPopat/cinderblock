import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveFloat extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^float+$/gm,
      chainable: false,
      parse: (w) =>
        w.expect("float").finish(({}, ctx) => new TypePrimitiveFloat(ctx)),
    });
  }

  get name() {
    return "float";
  }
}
