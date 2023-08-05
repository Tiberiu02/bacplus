"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import type { ChangeEventHandler } from "react";
import { LinkText } from "~/components/LinkText";
import unidecode from "unidecode";
import { scoalaFromDataArray } from "~/data/data";
import type { Scoala, ScoalaDataArray } from "~/data/data";
import { formtaNumber } from "~/data/formatNumber";
import { judetDupaCod } from "~/data/coduriJudete";

export function TabelScoli({ data }: { data: ScoalaDataArray[] }) {
  const [sortField, setSortField] = useState<keyof Scoala>(
    "medieEvaluareNationala"
  );
  const [sortOrder, setSortOrder] = useState<1 | -1>(-1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});

  const onGlobalFilterChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = unidecode(e.target.value);
    setFilters({
      key: { value, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue(value);
  };

  const scoli = data
    .map(scoalaFromDataArray)
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const aNull = aVal === undefined;
      const bNull = bVal === undefined;

      return sortOrder == 1
        ? bNull || (!aNull && aVal < bVal)
          ? -1
          : aNull || aVal > bVal
          ? 1
          : 0
        : bNull || (!aNull && aVal > bVal)
        ? -1
        : aNull || aVal > bVal
        ? 1
        : 0;
    })
    .map((row, ix) => ({
      ...row,
      rowIndex: ix + 1,
      key: unidecode(row.numeScoala).toLowerCase(),
    }));

  const doarUnJudet = scoli.every(
    (scoala) => scoala.codJudet == scoli[0]?.codJudet
  );

  const header = (
    <div className="flex justify-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Caută școală"
        />
      </span>
    </div>
  );

  const colStyle: React.CSSProperties = {
    textAlign: "center",
    width: "0px",
    padding: "0.5rem 1rem",
  };

  return (
    <DataTable
      value={scoli}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50, 100]}
      sortField={sortField}
      sortOrder={sortOrder}
      filters={filters}
      header={header}
      showGridlines
      onSort={(e) => {
        setSortOrder(
          sortField == e.sortField
            ? e.sortOrder == 1
              ? 1
              : -1
            : e.sortOrder == 1
            ? -1
            : 1
        );
        setSortField(e.sortField as keyof Scoala);
      }}
    >
      <Column
        header="Loc"
        style={colStyle}
        body={({ rowIndex }: { rowIndex: number }) => rowIndex}
      />
      <Column
        field="numeScoala"
        header="Nume școală"
        body={({ id, numeScoala }: Scoala) => (
          <LinkText href={`/scoala/${id}`}>{numeScoala}</LinkText>
        )}
        style={{
          padding: "0.5rem 1rem",
        }}
      />
      {!doarUnJudet && (
        <Column
          field="codJudet"
          header={
            <div className="[span:has(&)]:w-full [span:has(&)]:text-center">
              Județ
            </div>
          }
          body={({ codJudet }: Scoala) => (
            <LinkText href={`/judet/${judetDupaCod(codJudet).nume}`}>
              {judetDupaCod(codJudet).numeIntreg}
            </LinkText>
          )}
          style={colStyle}
        />
      )}
      <Column
        field="medieEvaluareNationala"
        sortable
        header="Medie Evaluare Națională"
        style={colStyle}
        body={(rowData: Scoala) =>
          formtaNumber(rowData["medieEvaluareNationala"], 2)
        }
      />
      <Column
        sortable
        field="medieLimbaRomana"
        header={<>Medie limba română</>}
        style={colStyle}
        body={(rowData: Scoala) => formtaNumber(rowData["medieLimbaRomana"], 2)}
      />
      <Column
        sortable
        field="medieMatematica"
        header={<>Medie matematică</>}
        style={colStyle}
        body={(rowData: Scoala) => formtaNumber(rowData["medieMatematica"], 2)}
      />
      {scoli.some((scoala) => scoala.medieAbsolvire) && (
        <Column
          sortable
          field="medieAbsolvire"
          header={<>Medie absolvire</>}
          style={colStyle}
          body={(rowData: Scoala) => formtaNumber(rowData["medieAbsolvire"], 2)}
        />
      )}
      <Column
        field="numCandidati"
        sortable
        header="Absolvenți"
        style={colStyle}
      />
    </DataTable>
  );
}
