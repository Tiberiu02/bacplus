"use client";

import { useMemo, useState } from "react";
import type { ChangeEventHandler } from "react";
import unidecode from "unidecode";
import { formtaNumber } from "~/data/formatNumber";
import { PercentageBar } from "./PercentageBar";
import {
  FaArrowDownLong,
  FaArrowUpLong,
  FaArrowsUpDown,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ColumnType<T> =
  | (
      | {
          type: "text";
          value: (rowData: T, rowIndex: number) => string | undefined;
          href?: (rowData: T, rowIndex: number) => string;
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
      tdClassName?: string;
    };

const SHOW_ROWS_DEFAULT = 50;
const SHOW_ROWS_INCREMENT = 25;

export function Table<CompressedRowType, RowType = CompressedRowType>({
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
  type RowTypeExtra = RowType & {
    key: string;
    _rowIndex: number;
  };

  const router = useRouter();

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
        searchField
          ?.value(row, 0)
          ?.toString()
          .toLowerCase()
          .replace(/[^\w\d ]/g, "") ?? "";
    });

    return rows;
  }, [compressedData, decompressionFn, searchField]);

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

  const onGlobalFilterChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = unidecode(e.target.value)
      .toLowerCase()
      .replace(/[^\w\d ]/g, "");
    setGlobalFilterValue(value);
  };

  const href = columns
    .map((column) => column.type == "text" && column.href)
    .find((href) => href);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-10 items-center gap-4 rounded border-[1px] border-gray-300 px-3 text-black transition-all duration-200 focus-within:border-blue-700 hover:border-blue-700">
        <FaMagnifyingGlass className="shrink-0 text-gray-400" />
        <input
          className="w-full outline-none"
          placeholder={searchPlaceholder}
          onChange={onGlobalFilterChange}
        />
      </div>
      <div className="-my-2 max-w-full overflow-y-auto">
        <table className="border-separate border-spacing-y-2">
          <thead className="[&>*>*:first-child]:rounded-l [&>*>*:first-child]:border-l-[1px] [&>*>*:last-child]:rounded-r [&>*>*:last-child]:border-r-[1px]">
            <tr>
              {columns.map((column, cIx) => (
                <th
                  key={cIx}
                  className={twMerge(
                    "select-none border-y-[1px] border-gray-300 bg-gray-50 px-3 py-3",
                    column.type == "text"
                      ? column.textAlign == "left"
                        ? "text-left"
                        : column.textAlign == "right"
                        ? "text-right"
                        : "text-center"
                      : "",
                    column.sortable && "cursor-pointer",
                    column.sortable &&
                      sortColumnIx == cIx &&
                      "!bg-indigo-50 text-indigo-600",
                    column.widthGrow ? "w-full" : "w-fit"
                  )}
                  onClick={() => {
                    if (column.sortable) {
                      setSortOrder(
                        sortColumnIx == cIx
                          ? sortOrder == 1
                            ? -1
                            : 1
                          : column.primarySortOrder == "ASC"
                          ? 1
                          : -1
                      );
                      setSortColumnIx(cIx);
                      setShowRows(SHOW_ROWS_DEFAULT);
                    }
                  }}
                >
                  <div className="left-0 flex flex-row items-center gap-1">
                    {column.header}
                    {column.sortable &&
                      (sortColumnIx == cIx ? (
                        sortOrder == 1 ? (
                          <FaArrowUpLong className="shrink-0" />
                        ) : (
                          <FaArrowDownLong className="shrink-0" />
                        )
                      ) : (
                        <FaArrowsUpDown className="shrink-0" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className={twMerge(
              "text-center [&>*>*:first-child]:rounded-l [&>*>*:first-child]:border-l-[1px] [&>*>*:last-child]:rounded-r [&>*>*:last-child]:border-r-[1px] [&>*>*]:border-y-[1px] [&>*>*]:border-gray-300 [&>*>*]:px-3 [&>*>*]:py-3 [&>*]:bg-white",
              href
                ? "[&>*>*]:transition-all [&>*>*]:duration-200 [&>*]:cursor-pointer [&>*]:hover:[&>*]:border-blue-700 [&>*]:hover:[&>*]:bg-gray-50"
                : undefined
            )}
          >
            {data
              .filter((row) => row.key.includes(globalFilterValue))
              .slice(0, showRows)
              .map((row, rIx) => (
                <tr
                  key={rIx}
                  onClick={href ? () => router.push(href(row, rIx)) : undefined}
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
                          "font-semibold"
                      )}
                    >
                      {column.type == "text" ? (
                        column.href ? (
                          <Link href={column.href(row, rIx)}>
                            {column.value(row, row._rowIndex)}
                          </Link>
                        ) : (
                          column.value(row, row._rowIndex)
                        )
                      ) : column.type == "number" ? (
                        formtaNumber(column.value(row, row._rowIndex), 2)
                      ) : column.type == "percentage" ? (
                        <PercentageBar
                          value={column.value(row, row._rowIndex) ?? 0}
                        />
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showRows < data.length && (
        <Button
          onClick={() => setShowRows(showRows + SHOW_ROWS_INCREMENT)}
          className="w-fit self-center"
        >
          Mai multe
        </Button>
      )}
    </div>
  );
}
