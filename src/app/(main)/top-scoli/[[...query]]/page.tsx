import { Title } from "~/components/Title";
import { JUDETE } from "~/data/coduriJudete";
import {
  enData,
  institutii,
  institutiiBac,
  query,
  ultimulAnEn,
} from "~/data/dbQuery";

import { MainContainer } from "~/components/MainContainer";
import { scoalaToDataArray } from "~/app/(main)/top-scoli/[[...query]]/data";
import type { Scoala } from "~/app/(main)/top-scoli/[[...query]]/data";
import type { Metadata } from "next";
import { LinkSelect } from "~/components/LinkSelect";
import { env } from "~/env.js";
import { Announcements } from "~/components/Announcements";
import { TabelScoli } from "~/app/(main)/top-scoli/[[...query]]/TabelScoli";
import { parseParamsTop } from "~/data/parseParams";
import { redirect } from "next/navigation";
import { getUrlFromId } from "~/data/institutie/urlFromId";
import { createStaticData } from "~/static-data/createStaticData";
import { beautifyNameNullable } from "~/data/institutie/beautifyName";

export function generateMetadata({
  params,
}: {
  params: { query: string[] };
}): Metadata {
  const [an, judet] = parseParamsTop(params.query, ultimulAnEn);
  const anCurent = new Date().getFullYear();

  const numeJudet = judet?.numeIntreg ?? "România";
  const title = `Școli Gimnaziale ${numeJudet} ${anCurent} – Evaluare Națională, Clasament, Hartă`;
  const description = `Descoperă clasamentul școlilor din ${numeJudet} la Evaluarea Națională ${an}`;

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
    robots: an != ultimulAnEn ? "noindex" : undefined,
  };
}

export function generateStaticParams() {
  const params = [
    [],
    ...JUDETE.map((judet) => [judet.nume.toLowerCase()]),
    ...query.aniEn.map(({ an }) => [an]),
    ...query.aniEn.flatMap(({ an }) =>
      JUDETE.map((judet) => [judet.nume.toLowerCase(), an])
    ),
  ];

  return params.map((params) => ({
    query: params.map((p) => p.toString()),
  }));
}

export default function Page({ params }: { params: { query: string[] } }) {
  const [an, judet, reversed] = parseParamsTop(params.query, ultimulAnEn);

  if (params.query && params.query.includes(ultimulAnEn.toString())) {
    redirect("/top-scoli" + (judet ? "/" + judet.nume : ""));
  }

  if (reversed) {
    redirect(
      "/top-scoli" +
        (judet ? "/" + judet.nume : "") +
        (an == ultimulAnEn ? "" : "/" + an.toString())
    );
  }

  const scoli = getScoli(an, judet?.id);

  const optionsAni = query.aniEn.map(({ an }) => ({
    value: `${an}`,
    label: `${an}`,
    link:
      "/top-scoli" +
      (judet ? "/" + judet.nume.toLowerCase() : "") +
      (an == ultimulAnEn ? "" : "/" + an.toString()),
  }));

  const optionsJudete = [
    {
      value: "",
      label: "Toate județele",
      link: an == ultimulAnEn ? "/top-scoli" : `/top-scoli/${an}`,
    },
    ...JUDETE.map((j) => ({
      value: j.nume,
      label: j.numeIntreg,
      link:
        an == ultimulAnEn
          ? `/top-scoli/${j.nume.toLowerCase()}`
          : `/top-scoli/${j.nume.toLowerCase()}/${an}`,
    })),
  ];

  const scoliData = scoli
    .sort(
      (a, b) =>
        (b.medieEvaluareNationala || 0) - (a.medieEvaluareNationala || 0)
    )
    .map(scoalaToDataArray);

  return (
    <>
      <MainContainer>
        <Title>
          Clasamentul Gimnaziilor {judet && `din ${judet.numeIntreg}`} la
          Evaluarea Națională
        </Title>

        <Announcements />

        {/* <div className="rounded-xl border-2 border-blue-100 bg-blue-50 px-3 py-2 text-center font-medium [text-wrap:balance] sm:px-4">
          <span className="font-bold">Nou!</span> Am adăugat rezultatele la
          Evaluarea Națională 2024 după de contestații.
        </div> */}

        <div className="flex flex-wrap-reverse justify-between gap-4">
          <LinkSelect
            defaultValue={judet?.nume ?? ""}
            options={optionsJudete}
            ariaLabel="Selectează județul"
            className="w-48 flex-shrink-0 max-md:flex-grow-[2]"
          />
          <LinkSelect
            defaultValue={an}
            options={optionsAni}
            ariaLabel="Selectează anul"
            className="shrink-0 max-md:flex-1"
          />
        </div>

        <TabelScoli
          data={createStaticData(scoliData, scoliData.slice(0, 50))}
          an={an}
        />
      </MainContainer>
    </>
  );
}

function getScoli(an: number, judet?: string) {
  const scoli = {} as {
    [id: string]: Scoala;
  };

  enData
    .filter(
      (result) =>
        result.an === an &&
        (judet === undefined ||
          result.unitate_cod_judet === judet ||
          result.siiirData?.judet_pj == judet)
    )
    .forEach((result) => {
      const id =
        result.unitate_siiir ??
        (result.unitate_nume ?? "") + (result.unitate_cod_judet ?? "");

      scoli[id] = {
        numeScoala:
          result.data?.nume ??
          beautifyNameNullable(result.siiirData?.denumire_lunga_unitate) ??
          beautifyNameNullable(result.unitate_nume) ??
          "",
        siiir: result.unitate_siiir ?? undefined,
        icon: result.data?.sigla_xs ?? false,
        url:
          result.unitate_siiir && institutii[result.unitate_siiir]
            ? getUrlFromId(result.unitate_siiir)
            : undefined,
        numCandidati: result._count._all,
        medieLimbaRomana: result._avg.lr_final?.toNumber() ?? undefined,
        medieLimbaMaterna: result._avg.lm_final?.toNumber() ?? undefined,
        medieMatematica: result._avg.ma_final?.toNumber() ?? undefined,
        medieAbsolvire: result._avg.medie_abs?.toNumber() ?? undefined,
        medieEvaluareNationala: result._avg.medie_en?.toNumber() ?? undefined,
        liceu: institutiiBac.has(result.unitate_siiir ?? ""),
      };
    });

  return Object.values(scoli);
}
