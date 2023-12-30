export function groupBy<T, D extends string>(
  data: T[],
  discriminator: (item: T) => D
) {
  const result: { [key in D]: T[] } = {} as any;
  data.forEach((item) => {
    const key = discriminator(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  });
  console.log(result);
  return Object.entries(result) as [D, T[]][];
}
