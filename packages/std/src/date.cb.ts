type DateIsoProps = {
  _s: bigint;
};

export function std_date_iso(props: DateIsoProps) {
  return new Date(Number(props._s)).toISOString();
}
