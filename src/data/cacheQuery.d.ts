// export function computeQuery<T, F extends () => Promise<T>>(
//   key: string,
//   f: F
// ): Promise<T>;

export function computeAllQueries<T>(obj: T): Promise<{
  [key in keyof typeof obj]: Awaited<ReturnType<(typeof obj)[key]>>;
}>;
