import { Suspense } from "react";
import { DynamicRedirect } from "~/components/DynamicRedirect";
import { query } from "~/data/dbQuery";
import { getUrlFromId } from "~/data/institutie/urlFromId";

// Used in combination with Edge Rules to redirect
// from thenpm  legacy /liceu/ID_LIKE_THIS and /scoala/ID_LIKE_THIS
// to the new /i/name-like-this
export default function Page() {
  return (
    <Suspense>
      <DynamicRedirect
        paramName="id"
        data={query.institutii.map((g) => ({
          value: g.id,
          redirect: `/i/${getUrlFromId(g.id)}`,
        }))}
        fallback={`/top-licee`}
      />
    </Suspense>
  );
}
