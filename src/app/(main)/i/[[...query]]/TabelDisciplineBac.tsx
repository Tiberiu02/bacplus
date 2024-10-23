"use client";

import { useState } from "react";
import { Table } from "~/components/Table";
import { Select } from "~/components/Select";

export function TabelDisciplineBac({
  discipline,
}: {
  discipline: {
    nume: string;
    elevi: number;
    medie: number | undefined;
    an: number;
  }[];
}) {
  const ani = [...new Set(discipline.map((e) => e.an))].sort((a, b) => b - a);
  const [an, setAn] = useState(ani[0] || 0);

  if (an == 0) return null;

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
      <div className="relative max-w-full flex-col items-center justify-between gap-4">
        <div className="text-center text-2xl font-semibold opacity-90 [text-wrap:balance] sm:text-3xl">
          Rezultate Bacalaureat pe discipline
        </div>
        <Select
          options={ani.map((e) => ({ value: e, label: e.toString() }))}
          value={an}
          onChange={setAn}
          ariaLabel="An discipline bac"
          className="mx-auto"
        />
      </div>
      <Table
        data={discipline.filter((e) => e.an === an)}
        searchable={false}
        columns={[
          {
            type: "text",
            value: (e) => e.nume,
            header: "Disciplină",
            textAlign: "left",
            sortable: true,
            primarySortOrder: "ASC",
          },
          {
            type: "number",
            value: (e) => e.medie ?? undefined,
            decimals: 2,
            header: "Medie",
            sortable: true,
          },
          {
            type: "number",
            value: (e) => e.elevi,
            decimals: 0,
            header: "Elevi",
            sortable: true,
            defaultSortingColumn: true,
          },
        ]}
      />
      <div className="mt-[calc(-0.5rem-1px)]" />
    </div>
  );
}
