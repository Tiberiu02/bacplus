"use client";

import { Chart as ChartPrimeReact } from "primereact/chart";
import type { ComponentProps, FC } from "react";

export const Chart: FC<ComponentProps<typeof ChartPrimeReact>> = (props) => (
  <ChartPrimeReact {...props} />
);
