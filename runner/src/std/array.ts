type ArrayMapProps = {
  _s: Array<unknown>;
  selector: (props: { item: unknown; index: number }) => unknown;
};

export function std_array_map(props: ArrayMapProps) {
  return props._s.map((item, index) => props.selector({ item, index }));
}

type ArrayJoinProps = {
  _s: Array<unknown>;
  separator: string;
};

export function std_array_join(props: ArrayJoinProps) {
  return props._s.join(props.separator);
}

type ArrayReduceProps = {
  _s: Array<unknown>;
  initial: unknown;
  reducer: (props: { item: unknown; index: number; current: unknown }) => unknown;
};

export function std_array_reduce(props: ArrayReduceProps) {
  return props._s.reduce((current, item, index) => props.reducer({ item, index, current }), props.initial);
}

type ArrayFilterProps = {
  _s: Array<unknown>;
  predicate: (props: { item: unknown; index: number }) => boolean;
};

export function std_array_filter(props: ArrayFilterProps) {
  return props._s.filter((item, index) => props.predicate({ item, index }));
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

type ArrayLengthProps = {
  _s: Array<unknown>;
};

export function std_array_length(props: ArrayLengthProps) {
  return props._s.length;
}
