type DateIsoProps = {
  _s: number;
};

export function std_date_iso(props: DateIsoProps) {
  return new Date(props._s).toISOString();
}
