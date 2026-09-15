import type { CinderBlockBinary } from "../CinderBlockBinary.ts";

type AppTaggedProps = {
  key: string;
  _s: string;
};

export function std_app_tagged(this: CinderBlockBinary, props: AppTaggedProps) {
  return this.withTag(props.key, props._s).map(
    ({ name }) =>
      (args: Record<string, unknown>) =>
        this.run(name, args),
  );
}
