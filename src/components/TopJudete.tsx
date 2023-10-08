"use client";

import { Judet } from "~/data/data";
import { TabelJudete } from "./tables/TabelJudete";
import { ShareButtons } from "./ShareButtons";
import { Select } from "./Select";
import { useState } from "react";

export function TopJudete({
  data,
}: {
  data: {
    [an: string]: Judet[];
  };
}) {
  const ani = Object.keys(data)
    .map(Number)
    .sort((a, b) => b - a);
  const [an, setAn] = useState(ani[0] ?? 0);

  return (
    <>
      <div className="flex flex-wrap-reverse justify-between gap-4">
        <div className="flex w-full flex-wrap gap-4 md:w-fit">
          <Select
            value={an}
            options={ani.map((an) => ({ value: an, label: an.toString() }))}
            onChange={setAn}
            ariaLabel="Selectează anul"
            className="w-28 shrink-0 max-md:flex-1"
          />
        </div>
        <ShareButtons className="md:w-fit" />
      </div>

      <TabelJudete data={data[an] ?? []} />
    </>
  );
}
