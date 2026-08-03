let current: Array<number> = [];

export const Namer = Object.freeze({
  get Next() {
    const subject = current[current.length - 1];
    if (typeof subject !== "number" || subject === 127) {
      current = [...current, 0];
    } else {
      current = [...current.slice(0, -1), subject + 1];
    }

    return String.fromCharCode(...current);
  },
});
