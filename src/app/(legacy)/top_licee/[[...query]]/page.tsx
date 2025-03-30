import { JUDETE } from "~/data/coduriJudete";
import { query, ultimulAnBac } from "~/data/dbQuery";

import type { Metadata } from "next";
import { env } from "~/env.js";
import { parseParamsTop } from "~/data/parseParams";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ query: string[] }>;
}): Promise<Metadata> {
  const { query: queryParams } = await params;
  const [an, judet] = parseParamsTop(queryParams, ultimulAnBac);

  const title = judet?.numeIntreg
    ? `Top licee ${judet?.numeIntreg} ${an} la Bacalaureat și Admitere`
    : `Top licee ${an} la Bacalaureat și Admitere`;

  const description = `Descoperă clasamentul liceelor din ${
    judet?.numeIntreg ?? "România"
  } ${an} la Bacalaureat și Admitere`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Bac Plus",
      images: ["/og-banner.webp"],
      url: env.WEBSITE_URL,
    },
    robots: an != ultimulAnBac ? "noindex" : undefined,
  };
}

export function generateStaticParams() {
  const params = [
    [],
    ...JUDETE.map((judet) => [judet.nume]),
    ...query.aniBac.map(({ an }) => [an]),
    ...query.aniBac.flatMap(({ an }) =>
      JUDETE.map((judet) => [judet.nume, an])
    ),
    ...JUDETE.map((judet) => [ultimulAnBac, judet.nume]),
  ];

  return params.map((params) => ({
    query: params.map((p) => p.toString()),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ query: string[] }>;
}) {
  const { query: queryParams } = await params;
  const [an, judet] = parseParamsTop(queryParams, ultimulAnBac);

  redirect(
    "/top-licee" +
      (judet ? "/" + judet.nume.toLowerCase() : "") +
      (an == ultimulAnBac ? "" : "/" + an.toString())
  );
}
