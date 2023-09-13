export function LdJson<T>({
  name,
  description,
  data,
  id,
  columns,
}: {
  name: string;
  description: string;
  data: T[];
  id: (row: T) => string;
  columns: {
    name: string;
    value: (row: T) => string | number | undefined;
    type: "string" | "decimal" | "integer";
  }[];
}) {
  const ldJson = {
    "@context": ["https://schema.org", { csvw: "https://www.w3.org/ns/csvw#" }],
    "@type": "Dataset",
    name,
    description,
    publisher: {
      "@type": "Organization",
      name: "BacPlus",
    },
    creator: {
      "@type": "Organization",
      name: "BacPlus",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    mainEntity: {
      "@type": "csvw:Table",
      "csvw:tableSchema": {
        "csvw:columns": columns.map((column) => ({
          "csvw:name": column.name,
          "csvw:datatype": column.type,
          "csvw:cells": data.map((row) => ({
            "csvw:value": column.value(row),
            "csvw:primaryKey": id(row),
          })),
        })),
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
    />
  );
}
