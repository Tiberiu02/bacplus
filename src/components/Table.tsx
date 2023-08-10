"use client";

import type { DataTableValue } from "primereact/datatable";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import type { ChangeEventHandler } from "react";
import { LinkText } from "~/components/LinkText";
import unidecode from "unidecode";
import { formtaNumber } from "~/data/formatNumber";
import { PercentageBar } from "./PercentageBar";
import { IoSearchOutline } from "react-icons/io5";

type ColumnType<T> =
  | (
      | {
          type: "text";
          value: (rowData: T, rowIndex: number) => string | undefined;
          href?: (rowData: T, rowIndex: number) => string | undefined;
          searchable?: boolean;
        }
      | (
          | {
              type: "number";
              value: (rowData: T, rowIndex: number) => number | undefined;
            }
          | {
              type: "percentage";
              value: (rowData: T, rowIndex: number) => number | undefined;
            }
        )
    ) & {
      header: string;
      sortable?: boolean;
      defaultSortingColumn?: true;
      primarySortOrder?: "ASC" | "DESC";
      widthGrow?: boolean;
      textAlign?: "left" | "center" | "right";
    };

export function Table<
  CompressedRowType extends DataTableValue,
  RowType extends DataTableValue = CompressedRowType
>({
  data: compressedData,
  decompressionFn,
  columns,
  searchPlaceholder,
}: {
  data: CompressedRowType[];
  decompressionFn?: (compressed: CompressedRowType) => RowType;
  columns: ColumnType<RowType>[];
  searchPlaceholder?: string;
}) {
  const searchField = columns.find(
    (column) => column.type == "text" && column.searchable
  );

  if (searchField && searchPlaceholder === undefined) {
    throw new Error(
      "searchPlaceholder is required when there is a searchable column"
    );
  }

  type RowTypeExtra = RowType & {
    key: string;
    _rowIndex: number;
  };

  const data = useMemo(() => {
    const rows = (
      decompressionFn ? compressedData.map(decompressionFn) : compressedData
    ) as RowTypeExtra[];

    rows.forEach((row) => {
      row.key = searchField?.value(row, 0)?.toString() ?? "";
    });

    return rows;
  }, [compressedData, decompressionFn, searchField]);

  const defaultSortColumnIx = columns.findIndex(
    (column) => column.sortable && column.defaultSortingColumn
  );
  const [sortColumnIx, setSortColumnIx] = useState(defaultSortColumnIx);
  const [sortOrder, setSortOrder] = useState<1 | -1>(
    columns[defaultSortColumnIx]?.primarySortOrder == "ASC" ? 1 : -1
  );

  const sortColumn = columns[sortColumnIx];

  if (sortColumn) {
    data.sort((a, b) => {
      const aVal = sortColumn.value(a, 0);
      const bVal = sortColumn.value(b, 0);

      const aNull = aVal === undefined;
      const bNull = bVal === undefined;

      return bNull || (!aNull && (sortOrder == 1 ? aVal < bVal : aVal > bVal))
        ? -1
        : aNull || (sortOrder == 1 ? aVal > bVal : aVal < bVal)
        ? 1
        : 0;
    });

    data.forEach((row, i) => {
      row._rowIndex = i;
    });
  }

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});

  const onGlobalFilterChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = unidecode(e.target.value);
    setFilters({
      key: { value, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue(value);
  };

  const header = searchPlaceholder ? (
    <span className="p-input-icon-left w-full">
      <IoSearchOutline />
      <InputText
        value={globalFilterValue}
        onChange={onGlobalFilterChange}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        className="my-[-1px] h-9 w-full rounded"
      />
    </span>
  ) : null;

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50, 100]}
      sortField={`${sortColumnIx}`}
      sortOrder={sortOrder}
      filters={filters}
      header={header}
      showGridlines
      onSort={(e) => {
        const sortField = parseInt(e.sortField);
        setSortOrder(
          sortColumnIx == sortField
            ? e.sortOrder == 1
              ? 1
              : -1
            : e.sortOrder == 1
            ? -1
            : 1
        );
        setSortColumnIx(sortField);
      }}
    >
      {columns.map((column, cIx) => (
        <Column
          key={cIx}
          field={`${cIx}`}
          header={<div className="[span:has(&)]:w-full">{column.header}</div>}
          sortable={column.sortable}
          style={{
            width: column.widthGrow ? "100%" : "",
            textAlign: column.textAlign || "center",
            padding: "0.5rem 0.75rem",
          }}
          body={(rowData: RowTypeExtra) =>
            column.type == "text" ? (
              column.href ? (
                <LinkText href={column.href(rowData, rowData._rowIndex)}>
                  {column.value(rowData, rowData._rowIndex)}
                </LinkText>
              ) : (
                column.value(rowData, rowData._rowIndex)
              )
            ) : column.type == "number" ? (
              formtaNumber(column.value(rowData, rowData._rowIndex), 2)
            ) : column.type == "percentage" ? (
              <PercentageBar value={column.value(rowData, rowData._rowIndex)} />
            ) : null
          }
        />
      ))}
    </DataTable>
  );
}
