import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveInt extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^int+$/gm,
      parse: (w) =>
        w.expect("int").finish(({}, ctx) => new TypePrimitiveInt(ctx)),
    });
  }

  get name() {
    return "int";
  }
}
