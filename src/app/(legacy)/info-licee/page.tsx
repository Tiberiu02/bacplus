import { Suspense } from "react";
import { DynamicRedirect } from "~/components/DynamicRedirect";
import { licee } from "~/data/dbQuery";

export default function Page() {
  return (
    <Suspense>
      <DynamicRedirect
        paramName="name"
        data={licee.map((liceu) => ({
          value: liceu.nume,
          redirect: `/liceu/${liceu.id}`,
        }))}
        fallback={`/top-licee`}
      />
    </Suspense>
  );
}
