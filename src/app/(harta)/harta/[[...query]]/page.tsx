import { judetDupaCod } from "~/data/coduriJudete";
import { query } from "~/data/dbQuery";

import type { Metadata } from "next";
import { env } from "~/env.mjs";
import { parseParamsHarta } from "~/data/parseParams";
import { Harta } from "./Harta";

import "leaflet/dist/leaflet.css";
import { largeIcons } from "~/data/icons";
import { getUrlFromId } from "~/data/institutie/urlFromId";

export function generateMetadata({
  params,
}: {
  params: { query: string[] };
}): Metadata {
  const [judet, arata] = parseParamsHarta(params.query);

  const arataText =
    arata === "licee"
      ? "liceelor"
      : arata === "gimnazii"
      ? "gimnaziilor"
      : "liceelor și gimnaziilor";

  const title = `Harta ${arataText} din ${judet?.numeIntreg ?? "România"}`;

  const description = `Descoperă harta ${arataText} din ${
    judet?.numeIntreg ?? "România"
  }`;

  return {
    title,
    description,
    metadataBase: new URL(env.WEBSITE_URL),
    icons: ["/favicon.ico"],
    viewport: {
      width: "device-width",
      height: "device-height",
      initialScale: 1,
      minimumScale: 1,
      userScalable: false,
    },
    openGraph: {
      title,
      description,
      siteName: "Bac Plus",
      images: ["/og-banner.jpg"],
      url: env.WEBSITE_URL,
    },
  };
}

export function generateStaticParams() {
  const params = [
    [],
    // ["licee"],
    // ["gimnazii"],
    // ...JUDETE.flatMap((judet) => [
    //   [judet.nume.toLowerCase()],
    //   [judet.nume.toLowerCase(), "licee"],
    //   [judet.nume.toLowerCase(), "gimnazii"],
    // ]),
  ] as string[][];

  return params.map((params) => ({
    query: params.map((p) => p.toString()),
  }));
}

export default function Page({ params }: { params: { query: string[] } }) {
  // const [judet, arata] = parseParamsHarta(params.query);

  const markers = query.institutii
    .filter((i) => i.latlong)
    .map((institutie) => ({
      id: institutie.id,
      url: getUrlFromId(institutie.id),
      nume: institutie.nume,
      judet: judetDupaCod(institutie.id.split("_").at(-1) || "").nume,
      lat: parseFloat(institutie.latlong?.split(",")[0] || "0"),
      long: parseFloat(institutie.latlong?.split(",")[1] || "0"),
      liceu: !!institutie.liceu,
      gimnaziu: !!institutie.gimnaziu,
      icon: largeIcons[institutie.id] || false,
    }));

  return (
    <>
      <Harta data={markers.reverse()} />
    </>
  );
}
