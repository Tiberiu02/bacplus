import { DynamicRedirect } from "~/components/DynamicRedirect";
import { query, ultimulAnBac } from "~/data/dbQuery";

export default function Page() {
  const licee = query.licee.map((liceu) => ({
    value: liceu.nume_liceu,
    redirect: `/liceu/${liceu.id_liceu}`,
  }));

  return (
    <DynamicRedirect
      paramName="name"
      data={licee}
      fallback={`/top_licee/${ultimulAnBac}`}
    />
  );
}