import { DynamicRedirect } from "~/components/DynamicRedirect";
import { JUDETE } from "~/data/coduriJudete";
import { query, ultimulAnBac } from "~/data/dbQuery";

export default function Page() {
  return (
    <DynamicRedirect
      paramName="name"
      data={JUDETE.map((judet) => ({
        value: judet.numeIntreg,
        redirect: `/judet/${judet.nume}`,
      }))}
      fallback={`/top_judete/${ultimulAnBac}`}
    />
  );
}
