import { institutiiBac, institutiiEn, query } from "~/data/dbQuery";

import type { Metadata, Viewport } from "next";
import { env } from "~/env.js";
import { Harta } from "./Harta";

import "leaflet/dist/leaflet.css";
import { getUrlFromId } from "~/data/institutie/urlFromId";
import { Suspense } from "react";
import { createStaticData } from "~/static-data/createStaticData";

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export function generateMetadata(): Metadata {
  const title = `Harta liceelor și gimnaziilor`;

  const description = `Descoperă harta liceelor și gimnaziilor din România.`;

  return {
    title,
    description,
    metadataBase: new URL(env.WEBSITE_URL),
    icons: ["/favicon.ico"],
    openGraph: {
      title,
      description,
      siteName: "Bac Plus",
      images: ["/og-banner.webp"],
      url: env.WEBSITE_URL,
    },
  };
}

export function generateStaticParams() {
  const params = [[]] as string[][];

  return params.map((params) => ({
    query: params.map((p) => p.toString()),
  }));
}

export default function Page() {
  const markers = query.institutii
    .filter((i) => i.latlong)
    .map((institutie) => ({
      id: institutie.cod_siiir,
      url: getUrlFromId(institutie.cod_siiir) || "",
      nume: institutie.nume,
      lat: parseFloat(institutie.latlong?.split(",")[0] || "0"),
      long: parseFloat(institutie.latlong?.split(",")[1] || "0"),
      liceu: institutiiBac.has(institutie.cod_siiir),
      gimnaziu: institutiiEn.has(institutie.cod_siiir),
      icon: institutie.sigla_lg,
    }));

  return (
    <Suspense>
      <Harta data={createStaticData(markers.reverse(), [])} />
    </Suspense>
  );
}
