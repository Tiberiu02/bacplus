"use client";

import { useState } from "react";
import { Table } from "../Table";
import { Select } from "../Select";

export function TabelSpecializari({
  specializari,
}: {
  specializari: {
    nume: string;
    admisi: number;
    medie: number | null;
    an: number;
  }[];
}) {
  const ani = [...new Set(specializari.map((e) => e.an))].sort((a, b) => b - a);
  const [an, setAn] = useState(ani[0] || 0);

  if (an == 0) return null;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="relative w-full max-w-full flex-col items-center gap-4">
        <div className="text-center text-xl font-semibold opacity-90">
          Admitere specializări
        </div>
        <Select
          options={ani.map((e) => ({ value: e, label: e.toString() }))}
          value={an}
          onChange={setAn}
          ariaLabel="An specializări admitere"
          className="mx-auto"
        />
      </div>
      <Table
        data={specializari.filter((e) => e.an === an)}
        searchable={false}
        columns={[
          {
            type: "text",
            value: (e) => e.nume,
            header: "Specializare",
            textAlign: "left",
          },
          {
            type: "number",
            decimals: 2,
            value: (e) => e.medie ?? undefined,
            header: "Ultima medie",
            sortable: true,
            defaultSortingColumn: true,
          },
          {
            type: "number",
            value: (e) => e.admisi,
            decimals: 0,
            header: "Elevi admiși",
            sortable: true,
          },
        ]}
      />
    </div>
  );
}
