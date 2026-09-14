type ArrayMapProps = {
  _s: Array<unknown>;
  selector: (props: { item: unknown; index: number }) => unknown;
};

export function std_array_map(props: ArrayMapProps) {
  return props._s.map((item, index) => props.selector({ item, index }));
}

type ArrayReduceProps = {
  _s: Array<unknown>;
  initial: unknown;
  reducer: (props: { item: unknown; index: number; current: unknown }) => unknown;
};

export function std_array_reduce(props: ArrayReduceProps) {
  return props._s.reduce((current, item, index) => props.reducer({ item, index, current }), props.initial);
}

type ArrayFindProps = {
  _s: Array<unknown>;
  predicate: (props: { item: unknown; index: number }) => boolean;
};

export function std_array_find(props: ArrayFindProps) {
  return props._s.find((item, index) => props.predicate({ item, index }));
}

type ArraySomeProps = {
  _s: Array<unknown>;
  predicate: (props: { item: unknown; index: number }) => boolean;
};

export function std_array_some(props: ArraySomeProps) {
  return props._s.some((item, index) => props.predicate({ item, index }));
}

type ArrayGetProps = {
  _s: Array<unknown>;
  i: number;
};

export function std_array_get(props: ArrayGetProps) {
  return props._s[props.i];
}
