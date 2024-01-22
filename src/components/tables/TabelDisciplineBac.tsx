"use client";

import { useState } from "react";
import { Table } from "../Table";
import { Card } from "../Cards";
import { Select } from "../Select";
import { FaGraduationCap } from "react-icons/fa6";

export function TabelDisciplineBac({
  discipline,
}: {
  discipline: {
    nume: string;
    elevi: number;
    medie: number | null;
    an: number;
  }[];
}) {
  const ani = [...new Set(discipline.map((e) => e.an))].sort((a, b) => b - a);
  const [an, setAn] = useState(ani[0] || 0);

  if (an == 0) return null;

  return (
    <Card className="overflow-hidden p-0">
      <div className="relative flex max-w-full items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <div className="flex items-center gap-4 ">
          <FaGraduationCap className="shrink-0 text-3xl text-blue-500 opacity-60" />
          <div className="text-xl font-semibold opacity-90">
            Rezultate bacalaureat
          </div>
        </div>
        <Select
          options={ani.map((e) => ({ value: e, label: e.toString() }))}
          value={an}
          onChange={setAn}
          ariaLabel="An specializări admitere"
          className=""
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
            defaultSortingColumn: true,
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
          },
        ]}
      />
      <div className="mt-[calc(-0.5rem-1px)]" />
    </Card>
  );
}
