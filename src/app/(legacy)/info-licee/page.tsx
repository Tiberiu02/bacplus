import { Suspense } from "react";
import { DynamicRedirect } from "~/components/DynamicRedirect";
import { licee } from "~/data/dbQuery";
import { getUrlFromId } from "~/data/institutie/urlFromId";

export default function Page() {
  return (
    <Suspense>
      <DynamicRedirect
        paramName="name"
        data={licee.map((liceu) => ({
          value: liceu.nume,
          redirect: "/i/" + getUrlFromId(liceu.cod_siiir),
        }))}
        fallback={`/top-licee`}
      />
    </Suspense>
  );
}
