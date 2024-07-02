import { Title } from "~/components/Title";
import { JUDETE } from "~/data/coduriJudete";
import { query, ultimulAnEn } from "~/data/dbQuery";

import { MainContainer } from "~/components/MainContainer";
import { scoalaToDataArray } from "~/app/(main)/top-scoli/[[...query]]/data";
import type { Scoala } from "~/app/(main)/top-scoli/[[...query]]/data";
import type { Metadata } from "next";
import { LinkSelect } from "~/components/LinkSelect";
import { env } from "~/env.js";
import { Announcements } from "~/components/Announcements";
import { TabelScoli } from "~/app/(main)/top-scoli/[[...query]]/TabelScoli";
import { LdJson } from "~/components/LdJson";
import { parseParamsTop } from "~/data/parseParams";
import { redirect } from "next/navigation";
import { smallIcons } from "~/data/icons";
import { getUrlFromId } from "~/data/institutie/urlFromId";
import { createStaticData } from "~/static-data/createStaticData";

export function generateMetadata({
  params,
}: {
  params: { query: string[] };
}): Metadata {
  const [an, judet] = parseParamsTop(params.query, ultimulAnEn);
  const anCurent = new Date().getFullYear();

  const title = `Școli Gimnaziale ${
    judet?.numeIntreg || "România"
  } ${anCurent} - Hartă, Clasament, Evaluare`;

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
      <LdJson
        name={
          judet?.numeIntreg
            ? `Top școli ${judet?.numeIntreg} ${an}`
            : `Top școli ${an}`
        }
        description={`Descoperă cele mai bune școli din ${
          judet?.numeIntreg ?? "România"
        } conform rezultatelor oficiale la Evaluarea Națională ${an} publicate de Ministerul Educației Naționale.`}
        data={scoli
          .filter((a) => a.medieEvaluareNationala)
          .sort((a, b) =>
            a.medieEvaluareNationala && b.medieEvaluareNationala
              ? b.medieEvaluareNationala - a.medieEvaluareNationala
              : 0
          )
          .slice(0, 10)}
        id={(scoala) => scoala.id}
        columns={[
          {
            name: "Nume scoala",
            value: (scoala) => scoala.numeScoala,
            type: "string",
          },
          {
            name: "Medie Evaluare",
            value: (scoala) =>
              scoala.medieEvaluareNationala
                ? Math.round(scoala.medieEvaluareNationala * 100) / 100
                : undefined,
            type: "decimal",
          },
          {
            name: "Medie Română",
            value: (scoala) =>
              scoala.medieLimbaRomana
                ? Math.round(scoala.medieLimbaRomana * 100) / 100
                : undefined,
            type: "decimal",
          },
          {
            name: "Medie Matematică",
            value: (scoala) =>
              scoala.medieMatematica
                ? Math.round(scoala.medieMatematica * 100) / 100
                : undefined,
            type: "decimal",
          },
        ]}
      />

      <MainContainer>
        <Title>
          Clasamentul gimnaziilor {judet && `din ${judet.numeIntreg}`} la
          Evaluarea Națională
        </Title>

        <Announcements />

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

  query.en
    .filter(
      (result) =>
        result.an === an && (result.id_judet === judet || judet === undefined)
    )
    .forEach((result) => {
      if (result.id_scoala === null) return;

      scoli[result.id_scoala] = {
        id: result.id_scoala,
        codJudet: result.id_judet,
        numeScoala: "",
        numCandidati: result._count._all,
        medieLimbaRomana: result._avg.lr_final ?? undefined,
        medieLimbaMaterna: result._avg.lm_final ?? undefined,
        medieMatematica: result._avg.ma_final ?? undefined,
        medieAbsolvire: result._avg.medie_abs ?? undefined,
        medieEvaluareNationala: result._avg.medie_en ?? undefined,
        icon: smallIcons[result.id_scoala] ?? false,
        url: getUrlFromId(result.id_scoala),
        liceu: false,
      };
    });

  query.institutii.forEach((scoala) => {
    const obj = scoli[scoala.id];
    if (obj != undefined) {
      obj.numeScoala = scoala.nume;
      obj.liceu = !!scoala.liceu;
    }
  });

  return Object.values(scoli);
}
