import { JUDETE } from "~/data/coduriJudete";
import { query, ultimulAnEn } from "~/data/dbQuery";

import type { Metadata } from "next";
import { env } from "~/env.mjs";
import { parseParamsTop } from "~/data/parseParamsTop";
import { redirect } from "next/navigation";

export function generateMetadata({
  params,
}: {
  params: { query: string[] };
}): Metadata {
  const [an, judet] = parseParamsTop(params.query, ultimulAnEn);

  const title = judet?.numeIntreg
    ? `Top școli ${judet?.numeIntreg} ${an} la Evaluarea Națională`
    : `Top școli ${an} la Evaluarea Națională`;

  const description = `Descoperă clasamentul școlilor din ${
    judet?.numeIntreg ?? "România"
  } la Evaluarea Națională ${an}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Bac Plus",
      images: ["/og-banner.jpg"],
      url: env.WEBSITE_URL,
    },
    robots: an != ultimulAnEn ? "noindex" : undefined,
  };
}

export function generateStaticParams() {
  const params = [
    [],
    ...JUDETE.map((judet) => [judet.nume]),
    ...query.aniEn.map(({ an }) => [an]),
    ...query.aniEn.flatMap(({ an }) => JUDETE.map((judet) => [judet.nume, an])),
    ...JUDETE.map((judet) => [ultimulAnEn, judet.nume]),
  ];

  return params.map((params) => ({
    query: params.map((p) => p.toString()),
  }));
}

export default function Page({ params }: { params: { query: string[] } }) {
  const [an, judet] = parseParamsTop(params.query, ultimulAnEn);

  redirect(
    "/top-scoli" +
      (judet ? "/" + judet.nume.toLocaleLowerCase() : "") +
      (an == ultimulAnEn ? "" : "/" + an.toString())
  );
}
