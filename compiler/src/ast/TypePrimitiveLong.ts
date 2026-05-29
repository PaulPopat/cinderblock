import { Type } from "./Type.ts";
import { TypePrimitive } from "./TypePrimitive.ts";

export class TypePrimitiveLong extends TypePrimitive {
  static {
    Type.RegisterType({
      priority: 150,
      match: /^long+$/gm,
      parse: (w) =>
        w.expect("long").finish(({}, ctx) => new TypePrimitiveLong(ctx)),
    });
  }

  get name() {
    return "long";
  }
}
