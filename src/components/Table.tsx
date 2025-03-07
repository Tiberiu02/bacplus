"use client";

import { useMemo, useState } from "react";
import type { ChangeEventHandler } from "react";
import { formatNumber } from "~/data/formatNumber";
import { PercentageBar } from "./PercentageBar";
import {
  FaMagnifyingGlass,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import Link from "next/link";
import { unidecode } from "~/data/unidecode";
import { TextInput } from "./TextInput";

type ColumnType<T> =
  | (
      | {
          type: "text";
          value: (rowData: T, rowIndex: number) => string | undefined;
          href?: (rowData: T, rowIndex: number) => string | undefined;
          searchable?: boolean;
        }
      | {
          type: "number";
          value: (rowData: T, rowIndex: number) => number | undefined;
          decimals: number;
        }
      | {
          type: "percentage";
          value: (rowData: T, rowIndex: number) => number | undefined;
        }
    ) & {
      header: string;
      sortable?: boolean;
      defaultSortingColumn?: true;
      primarySortOrder?: "ASC" | "DESC";
      widthGrow?: boolean;
      textAlign?: "left" | "center" | "right";
      tdClassName?: string;
      customRender?: (rowData: T, rowIndex: number) => JSX.Element;
    };

const SHOW_ROWS_DEFAULT = 50;
const SHOW_ROWS_INCREMENT = 25;

export function Table<CompressedRowType, RowType = CompressedRowType>({
  data: compressedData,
  decompressionFn,
  columns: columnsPossiblyFalse,
  searchPlaceholder,
  searchable,
  keyFn,
}: {
  data: CompressedRowType[];
  decompressionFn?: (compressed: CompressedRowType) => RowType;
  columns: (ColumnType<RowType> | false)[];
  searchPlaceholder?: string;
  searchable?: boolean;
  keyFn?: (row: RowType) => string;
}) {
  type RowTypeExtra = RowType & {
    key: string;
    _rowIndex: number;
  };

  const columns = columnsPossiblyFalse.filter(
    (column) => column
  ) as ColumnType<RowType>[];

  const searchField = columns.find(
    (column) => column.type == "text" && column.searchable
  );

  if (searchField && searchPlaceholder === undefined) {
    throw new Error(
      "searchPlaceholder is required when there is a searchable column"
    );
  }

  const defaultSortColumnIx = columns.findIndex(
    (column) => column.sortable && column.defaultSortingColumn
  );

  const [sortColumnIx, setSortColumnIx] = useState(defaultSortColumnIx);
  const [sortOrder, setSortOrder] = useState<1 | -1>(
    columns[defaultSortColumnIx]?.primarySortOrder == "ASC" ? 1 : -1
  );
  const [showRows, setShowRows] = useState(SHOW_ROWS_DEFAULT);

  const sortColumn = columns[sortColumnIx];

  const data = useMemo(() => {
    const rows = (
      decompressionFn ? compressedData.map(decompressionFn) : compressedData
    ) as RowTypeExtra[];

    rows.forEach((row) => {
      row.key =
        unidecode(searchField?.value(row, 0)?.toString() || "")
          .toLowerCase()
          .replace(/[^\w\d]/g, "") ?? "";
    });

    return rows;
  }, [compressedData, decompressionFn, searchField]);

  const [searchValue, setSearchValue] = useState("");
  const globalFilterValue = searchValue.toLowerCase().replace(/[^a-z0-9]/g, "");

  const href = columns
    .map((column) => column.type == "text" && column.href)
    .find((href) => href);

  const filteredData = useMemo(() => {
    if (sortColumn) {
      data.sort((a, b) => {
        const aVal = sortColumn.value(a, 0);
        const bVal = sortColumn.value(b, 0);

        const aNull = aVal === undefined || aVal === null;
        const bNull = bVal === undefined || bVal === null;

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

    return data.filter((row) => row.key.includes(globalFilterValue));
  }, [data, globalFilterValue, sortColumn, sortOrder]);

  return (
    <div className="flex w-full flex-col gap-4">
      {searchable != false && (
        <TextInput
          placeHolder={searchPlaceholder ?? ""}
          onChange={setSearchValue}
          Icon={FaMagnifyingGlass}
          value={searchValue}
        />
      )}
      <div className="-mx-3 -mt-2 w-[calc(100%+1.5rem)] overflow-y-auto px-3">
        <table className="my-2 w-full border-separate border-spacing-y-0">
          <thead>
            <tr>
              {columns.map((column, cIx) => (
                <th
                  key={cIx}
                  className={twMerge(
                    "select-none border-b-[1px] border-gray-200 px-3 py-3 font-semibold",
                    column.sortable && "cursor-pointer",
                    column.sortable && sortColumnIx == cIx && "text-blue-600",
                    column.widthGrow && "w-full",
                    column.textAlign == "left"
                      ? "text-left"
                      : column.textAlign == "right"
                      ? "text-right"
                      : "text-center"
                  )}
                  onClick={() => {
                    if (column.sortable) {
                      const primarySortOrder =
                        column.primarySortOrder == "ASC" ? 1 : -1;
                      setSortOrder(
                        sortColumnIx == cIx
                          ? sortOrder == 1
                            ? -1
                            : 1
                          : primarySortOrder
                      );
                      setSortColumnIx(cIx);
                      setShowRows(SHOW_ROWS_DEFAULT);
                    }
                  }}
                >
                  <div
                    className={twMerge(
                      "left-0 flex flex-row items-center gap-2",
                      column.textAlign == "left"
                        ? "justify-start"
                        : column.textAlign == "right"
                        ? "justify-end"
                        : "justify-center"
                    )}
                  >
                    {column.header}
                    {column.sortable &&
                      (sortColumnIx == cIx ? (
                        sortOrder == 1 ? (
                          <FaSortUp className="shrink-0 text-sm" />
                        ) : (
                          <FaSortDown className="shrink-0 text-sm" />
                        )
                      ) : (
                        <FaSort className="shrink-0 text-sm" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className={
              "text-center [&>*>*:first-child]:pr-3 [&>*>*]:border-b-[1px] [&>*>*]:border-gray-200 [&>*>*]:py-3 [&>*>*]:pl-3 [&>*>*]:pr-3 [&>*]:bg-white"
            }
          >
            {filteredData.slice(0, showRows).map((row, rIx) => {
              const url = href ? href(row, rIx) : undefined;

              return (
                <tr
                  key={keyFn ? keyFn(row) : row._rowIndex ? row._rowIndex : rIx}
                  onClick={
                    url
                      ? (e) => {
                          if (e.button != 0 || e.ctrlKey || e.metaKey) return;
                          e.preventDefault();
                          window.open(url, "_blank");
                        }
                      : undefined
                  }
                  className={
                    url
                      ? "[&>*>*]:duration-200 [&>*]:cursor-pointer"
                      : undefined
                  }
                >
                  {columns.map((column, cIx) => (
                    <td
                      key={cIx}
                      className={twMerge(
                        column.tdClassName,
                        column.textAlign == "left"
                          ? "text-left"
                          : column.textAlign == "right"
                          ? "text-right"
                          : "",
                        column.type == "number" &&
                          sortColumnIx == cIx &&
                          "font-medium",
                        column.sortable && "!pr-8"
                      )}
                    >
                      {column.type == "text" ? (
                        url ? (
                          <Link href={url} target="_blank">
                            {(column.customRender ?? column.value)(
                              row,
                              row._rowIndex
                            )}
                          </Link>
                        ) : (
                          (column.customRender ?? column.value)(
                            row,
                            row._rowIndex
                          )
                        )
                      ) : column.type == "number" ? (
                        formatNumber(
                          column.value(row, row._rowIndex),
                          column.decimals
                        )
                      ) : column.type == "percentage" ? (
                        <PercentageBar
                          value={column.value(row, row._rowIndex)}
                        />
                      ) : null}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showRows < filteredData.length && (
        <Button
          onClick={() => setShowRows(showRows + SHOW_ROWS_INCREMENT)}
          className="-mt-2 w-fit self-center"
        >
          Mai multe
        </Button>
      )}
    </div>
  );
}
