"use client";

import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import { trpc } from "~/utils/trpc";

import { Table } from "~/components/Table";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

export default function Dashboard() {
  const stats = trpc.stats.useQuery();

  return (
    <MainContainer>
      <Title>Contribuții</Title>

      <div className="flex flex-col gap-2">
        {stats.data ? (
          <Table
            columns={[
              {
                header: "Nume",
                type: "text",
                // textAlign: "left",
                value: (rowData) => rowData.name,
              },
              {
                header: "Sigle",
                type: "number",
                value: (rowData) => rowData.sigle,
                decimals: 0,
                sortable: true,
                primarySortOrder: "DESC",
                // defaultSortingColumn: true,
              },
              {
                header: "Imagini",
                type: "number",
                value: (rowData) => rowData.imagini,
                decimals: 0,
                sortable: true,
                primarySortOrder: "DESC",
                // defaultSortingColumn: true,
              },
            ]}
            data={stats.data}
            searchable={false}
          />
        ) : (
          <LoadingSpinner className="mx-auto" />
        )}
      </div>
    </MainContainer>
  );
}
