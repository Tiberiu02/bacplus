export function groupBy<T, D extends string>(
  data: T[],
  discriminator: (item: T) => D
) {
  const result = {} as { [key in D]: T[] };
  data.forEach((item) => {
    const key = discriminator(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  });
  return Object.entries(result) as [D, T[]][];
}
