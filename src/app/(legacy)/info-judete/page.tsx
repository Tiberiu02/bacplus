import { Suspense } from "react";
import { DynamicRedirect } from "~/components/DynamicRedirect";
import { JUDETE } from "~/data/coduriJudete";
import { ultimulAnBac } from "~/data/dbQuery";

export default function Page() {
  return (
    <Suspense>
      <DynamicRedirect
        paramName="name"
        data={JUDETE.map((judet) => ({
          value: judet.numeIntreg,
          redirect: `/judet/${judet.nume}`,
        }))}
        fallback={`/top_judete/${ultimulAnBac}`}
      />
    </Suspense>
  );
}
