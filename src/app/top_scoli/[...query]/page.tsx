import { Title } from "~/components/Title";
import { JUDETE } from "~/data/coduriJudete";
import { query } from "~/data/dbQuery";

import { MainContainer } from "~/components/MainContainer";
import { scoalaToDataArray } from "~/data/data";
import type { Scoala } from "~/data/data";
import type { Metadata } from "next";
import { ShareButtons } from "~/components/ShareButtons";
import { LinkSelect } from "~/components/LinkSelect";
import { env } from "~/env.mjs";
import { notFound } from "next/navigation";
import { Announcements } from "~/components/Announcements";
import { TabelScoli } from "../../../components/tables/TabelScoli";
import { LdJson } from "~/components/LdJson";
import { LinkText } from "~/components/LinkText";

export function generateMetadata({
  params,
}: {
  params: { query: string[] };
}): Metadata {
  const [an, numeJudet] = params.query;
  const numeIntregJudet = JUDETE.find((j) => j.nume === numeJudet)?.numeIntreg;

  if (!an) return {};

  const title = numeIntregJudet
    ? `Top școli generale ${numeIntregJudet} ${an}`
    : `Top școli generale ${an}`;

  const description = `Descoperă cele mai bune școli generale din ${
    numeIntregJudet ?? "România"
  } ${an}`;

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
  const params = query.aniEn
    .map(({ an }) => an.toString())
    .flatMap((an) => [
      { query: [an] },
      ...JUDETE.map((judet) => ({
        query: [an, judet.nume],
      })),
    ]);

  return params;
}

export default function Page({ params }: { params: { query: string[] } }) {
  const [an, numeJudet] = params.query;

  if (!an) notFound();

  const judet = JUDETE.find((j) => j.nume === numeJudet);

  const scoli = getScoli(parseInt(an), judet?.id);

  const optionsAni = query.aniEn.map(({ an }) => ({
    value: `${an}`,
    label: `${an}`,
    link: `/top_scoli/${an}${judet ? "/" + judet.nume : ""}`,
  }));

  const optionsJudete = [
    {
      value: "",
      label: "Național",
      link: `/top_scoli/${an}`,
    },
    ...JUDETE.map((j) => ({
      value: j.nume,
      label: j.numeIntreg,
      link: `/top_scoli/${an}/${j.nume}`,
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
          Clasamentul școlilor generale din {judet?.numeIntreg ?? "România"}{" "}
          {an}
        </Title>

        <Announcements />

        <p>
          Acest clasament a fost realizat folosind rezultatele oficiale la{" "}
          <LinkText href="http://evaluare.edu.ro/" target="_blank">
            Evaluarea Națională
          </LinkText>
          .
        </p>
        <p>
          Apăsați pe o anumită școală pentru a vedea mai multe statistici despre
          aceasta.
        </p>

        <div className="mt-4" />

        <div className="flex flex-wrap-reverse justify-between gap-4">
          <div className="flex w-full flex-wrap gap-4 md:w-fit">
            <LinkSelect
              defaultValue={an}
              options={optionsAni}
              ariaLabel="Selectează anul"
              className="w-28 shrink-0 max-md:flex-1"
            />
            <LinkSelect
              defaultValue={judet?.nume ?? ""}
              options={optionsJudete}
              ariaLabel="Selectează județul"
              className="w-48 flex-shrink-0 max-md:flex-grow-[2]"
            />
          </div>
          <ShareButtons className="md:w-fit" />
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
