"use client";

import { useState } from "react";
import { Table } from "~/components/Table";
import { Select } from "~/components/Select";

export type RezultateBacClase = {
  [an: number]: {
    discipline: {
      [disciplina: string]: boolean;
    };
    clase: {
      [clasa: string]: {
        [disciplina: string]: {
          medie: number;
          candidati: number;
        };
      };
    };
  };
};

export function TabelRezultateBacClase({
  rezultate,
}: {
  rezultate: RezultateBacClase;
}) {
  const ani = Object.keys(rezultate)
    .map((e) => parseInt(e))
    .sort((a, b) => b - a);
  const [an, setAn] = useState(ani[0] || 0);

  const discipline = Object.keys(rezultate[an]?.discipline || {});
  const [disciplina, setDisciplina] = useState<string>(discipline[0] || "");

  if (an == 0) return null;

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <div className="mb-8 text-center text-2xl font-semibold opacity-90 [text-wrap:balance] sm:text-3xl">
        Rezultate Bacalaureat pe clase
      </div>
      <div className="flex w-full flex-row gap-2">
        <Select
          options={ani.map((e) => ({ value: e, label: e.toString() }))}
          value={an}
          onChange={(newAn) => {
            setAn(newAn);
            if (!rezultate[newAn]?.discipline[disciplina]) {
              setDisciplina(
                Object.keys(rezultate[newAn]?.discipline || {})[0] || ""
              );
            }
          }}
          ariaLabel="An rezultate clase"
          className=""
        />
        <Select
          options={discipline.map((e) => ({ value: e, label: e }))}
          value={disciplina}
          onChange={setDisciplina}
          ariaLabel="Disciplina rezultate clase"
          className=""
        />
      </div>
      <Table
        data={Object.entries(rezultate[an]?.clase || {})}
        searchable={false}
        columns={[
          {
            type: "text",
            value: (e) => e[0],
            header: "Clasa",
            textAlign: "left",
            sortable: true,
            primarySortOrder: "ASC",
          },
          {
            type: "number",
            value: (e: [string, RezultateBacClase[number]["clase"][string]]) =>
              e[1][disciplina]?.medie ?? undefined,
            decimals: 2,
            header: "Medie",
            sortable: true,
            defaultSortingColumn: true,
          },
          {
            type: "number",
            value: (e: [string, RezultateBacClase[number]["clase"][string]]) =>
              e[1][disciplina]?.candidati ?? undefined,
            decimals: 0,
            textAlign: "right",
            header: "Elevi",
            sortable: true,
          },
        ]}
      />
      <div className="mt-[calc(-0.5rem-1px)]" />
    </div>
  );
}
