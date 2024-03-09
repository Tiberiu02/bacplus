import { useEffect, useState } from "react";
import type { StaticData } from "./staticData";

const staticDataRoute = "/static-data";

async function fetchStaticData<T>(
  hash: string,
  cancelObj = { cancel: false },
  retries = 5,
  cooldown = 250
): Promise<T> {
  try {
    const response = await fetch(`${staticDataRoute}/${hash}.json`);
    return (await response.json()) as T;
  } catch (error) {
    if (retries === 0) throw error;
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!cancelObj.cancel) {
          resolve(
            fetchStaticData<T>(hash, cancelObj, retries - 1, cooldown * 2)
          );
        }
      }, cooldown);
    });
  }
}

export function useStaticData<T>(staticData: StaticData<T>) {
  const [data, setData] = useState<T>(staticData.sampleData);

  useEffect(() => {
    const cancelObj = { cancel: false };
    void fetchStaticData<T>(staticData.hash, cancelObj).then((data) =>
      setData(data)
    );

    return () => {
      cancelObj.cancel = true;
    };
  }, [staticData.hash]);

  return data;
}
