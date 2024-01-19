import { Suspense } from "react";
import { DynamicRedirect } from "~/components/DynamicRedirect";
import { query, ultimulAnBac } from "~/data/dbQuery";

export default function Page() {
  const licee = query.licee.map((liceu) => ({
    value: liceu.nume_afisat,
    redirect: `/liceu/${liceu.id_liceu}`,
  }));

  return (
    <Suspense>
      <DynamicRedirect
        paramName="name"
        data={licee}
        fallback={`/top_licee/${ultimulAnBac}`}
      />
    </Suspense>
  );
}
