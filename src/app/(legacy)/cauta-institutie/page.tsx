import { Suspense } from "react";
import { DynamicRedirect } from "~/components/DynamicRedirect";
import { query } from "~/data/dbQuery";
import { getUrlFromId } from "~/data/institutie/urlFromId";

// Used in combination with Edge Rules to redirect
// from legacy /liceu/ID_LIKE_THIS and /scoala/ID_LIKE_THIS to this page: /cauta-institutie/ID_LIKE_THIS
// and then to the new /i/name-like-this
export default function Page() {
  return (
    <Suspense>
      <DynamicRedirect
        paramName="id"
        data={query.institutii
          .filter((i) => i.id_legacy)
          .map((g) => ({
            value: g.id_legacy ?? "",
            redirect: `/i/${getUrlFromId(g.cod_siiir)}`,
          }))}
        fallback={`/top-licee`}
      />
    </Suspense>
  );
}
