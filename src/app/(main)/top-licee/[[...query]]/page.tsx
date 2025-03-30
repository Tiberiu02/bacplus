import { Title } from "~/components/Title";
import { JUDETE } from "~/data/coduriJudete";
import { bacData, institutii, query, ultimulAnBac } from "~/data/dbQuery";

import { TabelLicee } from "~/app/(main)/top-licee/[[...query]]/TabelLicee";
import {
  type Liceu,
  liceuToDataArray,
} from "~/app/(main)/top-licee/[[...query]]/data";
import { MainContainer } from "~/components/MainContainer";
import type { Metadata } from "next";
import { LinkSelect } from "~/components/LinkSelect";
import { env } from "~/env.js";
import { Announcements } from "~/components/Announcements";
import { parseParamsTop } from "~/data/parseParams";
import { redirect } from "next/navigation";
import { getUrlFromId } from "~/data/institutie/urlFromId";
import { createStaticData } from "~/static-data/createStaticData";
import { beautifyNameNullable } from "~/data/institutie/beautifyName";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ query: string[] }>;
}): Promise<Metadata> {
  const { query: queryParams } = await params;
  const [an, judet] = parseParamsTop(queryParams, ultimulAnBac);
  const anCurent = new Date().getFullYear();

  const numeJudet = judet?.numeIntreg ?? "România";
  const title = `Licee ${numeJudet} ${anCurent} – Admitere, Bac, Clasament, Hartă`;
  const description = `Liceele din ${numeJudet} clasate după mediile la Bac și Admitere în ${an}. Harta liceelor din ${numeJudet}`;

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
    ...JUDETE.map((judet) => [judet.nume.toLowerCase()]),
    ...query.aniBac.map(({ an }) => [an]),
    ...query.aniBac.flatMap(({ an }) =>
      JUDETE.map((judet) => [judet.nume.toLowerCase(), an])
    ),
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

  if (queryParams && queryParams.includes(ultimulAnBac.toString())) {
    redirect("/top-licee" + (judet ? "/" + judet.nume : ""));
  }

  if (query.aniBac.every((a) => a.an != an)) {
    redirect("/top-licee");
  }

  const { licee, anAdmitere } = getLicee(an, judet?.id);

  const optionsAni = query.aniBac.map(({ an }) => ({
    value: `${an}`,
    label: `${an}`,
    link:
      "/top-licee" +
      (judet ? "/" + judet.nume.toLowerCase() : "") +
      (an == ultimulAnBac ? "" : "/" + an.toString()),
  }));

  const optionsJudete = [
    {
      value: "",
      label: "Toate județele",
      link: an == ultimulAnBac ? "/top-licee" : `/top-licee/${an}`,
    },
    ...JUDETE.map((j) => ({
      value: j.nume,
      label: j.numeIntreg,
      link:
        an == ultimulAnBac
          ? `/top-licee/${j.nume.toLowerCase()}`
          : `/top-licee/${j.nume.toLowerCase()}/${an}`,
    })),
  ];

  const liceeData = licee
    .sort((a, b) => (b.medieBac || 0) - (a.medieBac || 0))
    .map(liceuToDataArray);

  return (
    <>
      <MainContainer>
        <Title>
          Clasamentul Liceelor {judet && "din " + judet.numeIntreg} la
          Bacalaureat și Admitere
        </Title>

        <Announcements />

        {/* <Link target="_blank" href="/calculator-admitere" className="">
          <div className="rounded-xl border-2 border-emerald-100 bg-emerald-50 px-3 py-2 text-center font-medium [text-wrap:balance] sm:px-4">
            <span className="font-bold">Ai dat Evaluarea Națională?</span> Află
            ce șanse ai să intri la liceul dorit folosind pagina{" "}
            <span className="font-semibold text-blue-800">
              Calculator Admitere
            </span>
            !
          </div>
        </Link> */}

        {/* <div className="rounded-xl border-2 border-teal-100 bg-teal-50 px-3 py-2 text-center font-medium [text-wrap:balance] sm:px-4">
          <span className="font-bold">Nou!</span> Am adăugat rezultatele la
          Admitere 2024.
        </div> */}

        <div className="flex flex-wrap-reverse justify-between gap-4">
          <LinkSelect
            defaultValue={judet?.nume ?? ""}
            options={optionsJudete}
            ariaLabel="Selectează județul"
            className="flex-shrink-0"
          />
          <LinkSelect
            defaultValue={an}
            options={optionsAni}
            ariaLabel="Selectează anul"
            className="shrink-0"
          />
        </div>

        <TabelLicee
          data={createStaticData(liceeData, liceeData.slice(0, 51))}
          anAdmitere={anAdmitere?.an ?? an}
          anBac={an}
        />
      </MainContainer>
    </>
  );
}

function getLicee(an: number, judet?: string) {
  const licee = {} as {
    [id: string]: Liceu;
  };

  bacData
    .filter(
      (result) =>
        result.an === an &&
        // Filter out invalid data
        (!result.siiirData ||
          !result.unitate_cod_judet ||
          result.unitate_cod_judet == result.siiirData.judet_pj) &&
        (judet === undefined ||
          result.unitate_cod_judet === judet ||
          result.siiirData?.judet_pj === judet)
    )
    .forEach((result) => {
      const id =
        result.unitate_siiir ??
        (result.unitate_nume ?? "") + (result.unitate_cod_judet ?? "");

      licee[id] = {
        numeLiceu:
          result.data?.nume ??
          beautifyNameNullable(result.siiirData?.denumire_lunga_unitate) ??
          beautifyNameNullable(result.unitate_nume) ??
          "",
        siiir: result.unitate_siiir ?? undefined,
        icon: result.data?.sigla_xs ?? false,
        urlId:
          result.unitate_siiir && institutii[result.unitate_siiir]
            ? getUrlFromId(result.unitate_siiir)
            : undefined,
        medieBac: result._avg.medie?.toNumber() ?? undefined,
        numCandidati: result._count._all,
        numCandidatiValizi: result._count.medie,
        rataPromovare: 0,
      };
    });

  query.promovatiBac
    .filter(
      (result) =>
        result.an === an &&
        // Filter out invalid data
        (!result.unitate_siiir ||
          !result.unitate_cod_judet ||
          !institutii[result.unitate_siiir] ||
          result.unitate_cod_judet ==
            institutii[result.unitate_siiir]?.cod_judet)
    )
    .forEach((result) => {
      const id =
        result.unitate_siiir ??
        (result.unitate_nume ?? "") + (result.unitate_cod_judet ?? "");

      const liceu = licee[id];

      if (liceu && liceu.numCandidatiValizi) {
        liceu.rataPromovare =
          (result._count._all / liceu.numCandidatiValizi) * 100;
      }
    });

  const anAdmitere =
    query.aniAdm.find((a) => a.an == an) ??
    (query.aniAdm[0] && an > query.aniAdm[0].an
      ? query.aniAdm[0]
      : query.aniAdm[query.aniAdm.length - 1]);

  query.mediiAdmLicee
    .filter((result) => result.an === anAdmitere?.an)
    .forEach((result) => {
      if (result.repartizat_liceu_siiir === null) return;

      const liceu = licee[result.repartizat_liceu_siiir];

      if (liceu) {
        liceu.medieAdm = result._min.medie_adm?.toNumber() ?? undefined;
      }
    });

  return { licee: Object.values(licee), anAdmitere };
}
