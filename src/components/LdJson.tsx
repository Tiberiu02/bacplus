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
        // [
        //   {
        //     "csvw:name": "Year",
        //     "csvw:datatype": "string",
        //     "csvw:cells": [
        //       {
        //         "csvw:value": "2016",
        //         "csvw:primaryKey": "2016",
        //       },
        //       {
        //         "csvw:value": "2015",
        //         "csvw:primaryKey": "2015",
        //       },
        //     ],
        //   },
        //   {
        //     "csvw:name": "Organization name",
        //     "csvw:datatype": "string",
        //     "csvw:cells": [
        //       {
        //         "csvw:value": "AMERICAN HUMANE ASSOCIATION",
        //         "csvw:primaryKey": "2016",
        //       },
        //       {
        //         "csvw:value": "AMERICAN HUMANE ASSOCIATION",
        //         "csvw:primaryKey": "2015",
        //       },
        //     ],
        //   },
        //   {
        //     "csvw:name": "Organization address",
        //     "csvw:datatype": "string",
        //     "csvw:cells": [
        //       {
        //         "csvw:value": "1400 16TH STREET NW",
        //         "csvw:primaryKey": "2016",
        //       },
        //       {
        //         "csvw:value": "1400 16TH STREET NW",
        //         "csvw:primaryKey": "2015",
        //       },
        //     ],
        //   },
        //   {
        //     "csvw:name": "Organization NTEE Code",
        //     "csvw:datatype": "string",
        //     "csvw:cells": [
        //       {
        //         "csvw:value": "D200",
        //         "csvw:notes": "Animal Protection and Welfare",
        //         "csvw:primaryKey": "2016",
        //       },
        //       {
        //         "csvw:value": "D200",
        //         "csvw:notes": "Animal Protection and Welfare",
        //         "csvw:primaryKey": "2015",
        //       },
        //     ],
        //   },
        //   {
        //     "csvw:name": "Total functional expenses ($)",
        //     "csvw:datatype": "integer",
        //     "csvw:cells": [
        //       {
        //         "csvw:value": "13800212",
        //         "csvw:primaryKey": "2016",
        //       },
        //       {
        //         "csvw:value": "13800212",
        //         "csvw:primaryKey": "2015",
        //       },
        //     ],
        //   },
        // ],
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
