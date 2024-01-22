import { Title } from "~/components/Title";
import { JUDETE } from "~/data/coduriJudete";
import { query, ultimulAnEn } from "~/data/dbQuery";

import { MainContainer } from "~/components/MainContainer";
import { scoalaToDataArray } from "~/data/data";
import type { Scoala } from "~/data/data";
import type { Metadata } from "next";
import { LinkSelect } from "~/components/LinkSelect";
import { env } from "~/env.mjs";
import { Announcements } from "~/components/Announcements";
import { TabelScoli } from "../../../components/tables/TabelScoli";
import { LdJson } from "~/components/LdJson";
import { parseParamsTop } from "~/data/parseParamsTop";
import { redirect } from "next/navigation";
import { smallIcons } from "~/data/icons";

export function generateMetadata({
  params,
}: {
  params: { query: string[] };
}): Metadata {
  const [an, judet] = parseParamsTop(params.query, ultimulAnEn);

  const title = judet?.numeIntreg
    ? `Top școli generale ${judet?.numeIntreg} ${an} la Evaluarea Națională`
    : `Top școli generale ${an} la Evaluarea Națională`;

  const description = `Descoperă clasamentul școlilor generale din ${
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
  const [an, judet, reversed] = parseParamsTop(params.query, ultimulAnEn);

  if (reversed) {
    redirect(
      "/top_licee" +
        (judet ? "/" + judet.nume : "") +
        (an == ultimulAnEn ? "" : "/" + an.toString())
    );
  }

  const scoli = getScoli(an, judet?.id);

  const optionsAni = query.aniEn.map(({ an }) => ({
    value: `${an}`,
    label: `${an}`,
    link:
      "/top_scoli" +
      (judet ? "/" + judet.nume : "") +
      (an == ultimulAnEn ? "" : "/" + an.toString()),
  }));

  const optionsJudete = [
    {
      value: "",
      label: "Toate județele",
      link: an == ultimulAnEn ? "/top_scoli" : `/top_scoli/${an}`,
    },
    ...JUDETE.map((j) => ({
      value: j.nume,
      label: j.numeIntreg,
      link:
        an == ultimulAnEn
          ? `/top_scoli/${j.nume}`
          : `/top_scoli/${j.nume}/${an}`,
    })),
  ];

  return (
    <>
      <LdJson
        name={
          judet?.numeIntreg
            ? `Top școli generale ${judet?.numeIntreg} ${an}`
            : `Top școli generale ${an}`
        }
        description={`Descoperă cele mai bune școli generale din ${
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
          Clasamentul școlilor generale {judet && `din ${judet.numeIntreg}`} la
          Evaluarea Națională
        </Title>

        <Announcements />

        <div className="mt-4" />

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

        <TabelScoli data={scoli.map(scoalaToDataArray)} />
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
      };
    });

  query.scoli.forEach((scoala) => {
    const obj = scoli[scoala.id_scoala];
    if (obj != undefined) {
      obj.numeScoala = scoala.nume_afisat;
    }
  });

  return Object.values(scoli);
}
