import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveChar extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^char+$/gm,
      parse: (w) =>
        w.expect("char").finish(({}, ctx) => new TypePrimitiveChar(ctx)),
    });
  }

  get name() {
    return "char";
  }
}
