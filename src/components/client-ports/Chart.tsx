"use client";

import { Chart as ChartPrimeReact } from "primereact/chart";
import { useState, type ComponentProps, type FC, useEffect } from "react";

export const Chart: FC<ComponentProps<typeof ChartPrimeReact>> = (props) => {
  const [lastRerender, setLastRerender] = useState(0);

  useEffect(() => {
    const onResize = () => {
      console.log("rerendering chart");
      setLastRerender(Date.now());
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [lastRerender]);

  return [<ChartPrimeReact key={lastRerender} {...props} />];
};
