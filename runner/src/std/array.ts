type ArrayMapProps = {
  _s: Array<unknown>;
  selector: (props: { item: unknown; index: number }) => unknown;
};

export function std_array_map(props: ArrayMapProps) {
  return props._s.map((item, index) => props.selector({ item, index }));
}

type ArrayGetProps = {
  _s: Array<unknown>;
  i: number;
};

export function std_array_get(props: ArrayGetProps) {
  return props._s[props.i];
}
