"use client";

import { useState } from "react";
import { Table } from "../Table";
import { Card } from "../Cards";
import { FaUniversity } from "react-icons/fa";
import { Select } from "../Select";

type Specializare = {
  nume: string;
  admisi: number;
  medie: number | null;
  an: number;
};

export function TabelSpecializari({
  specializari,
}: {
  specializari: Specializare[];
}) {
  const ani = [...new Set(specializari.map((e) => e.an))].sort((a, b) => b - a);
  const [an, setAn] = useState(ani[0] || 0);

  return (
    <Card className="overflow-hidden border-b-0 p-0">
      <div className="relative flex max-w-full items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <div className="flex items-center gap-4 ">
          <FaUniversity className="shrink-0 text-3xl text-blue-500 opacity-60" />
          <div className="text-xl font-semibold opacity-90">
            Admitere specializări
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
        data={specializari.filter((e) => e.an === an)}
        searchable={false}
        flatHeader
        columns={[
          {
            type: "text",
            value: (e) => e.nume,
            header: "Specializare",
            textAlign: "left",
          },
          {
            type: "number",
            value: (e) => e.medie ?? undefined,
            header: "Ultima medie",
            sortable: true,
            defaultSortingColumn: true,
          },
          {
            type: "number",
            value: (e) => e.admisi,
            header: "Elevi admiși",
            sortable: true,
          },
        ]}
      />
    </Card>
  );
}
