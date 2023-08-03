import { Title } from "~/components/Title";
import { JUDETE } from "~/data/coduriJudete";
import { queryEn, queryScoli, aniEn } from "~/data/dbQuery";

import { TabelScoli } from "./TabelScoli";
import { MainContainer } from "~/components/MainContainer";
import { scoalaToDataArray } from "~/data/data";
import type { Scoala } from "~/data/data";
import type { Metadata } from "next";
import { ShareButtons } from "~/components/ShareButtons";
import { LinkSelect } from "~/components/LinkSelect";

export function generateMetadata({
  params,
}: {
  params: { query: string[] };
}): Metadata {
  const [an, numeJudet] = params.query;
  const numeIntregJudet = JUDETE.find((j) => j.nume === numeJudet)?.numeIntreg;

  if (!an) return {};

  const title = numeIntregJudet
    ? `Top școli generale ${numeIntregJudet} ${an} | Bac Plus`
    : `Top școli generale ${an} | Bac Plus`;

  const description = `Descoperă cele mai bune școli generale din ${
    numeIntregJudet ?? "România"
  } ${an}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export function generateStaticParams() {
  const params = aniEn
    .map((an) => an.toString())
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

  if (!an) return <div>404</div>;

  const judet = JUDETE.find((j) => j.nume === numeJudet);

  const scoli = getScoli(parseInt(an), judet?.id);

  const optionsAni = aniEn.map((an) => ({
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
      <MainContainer>
        <Title>
          Clasamentul școlilor generale din {judet?.numeIntreg ?? "România"}{" "}
          {an}
        </Title>
        <div className="mb-4 flex flex-col gap-2">
          <p>
            Acest clasament conține {scoli.length} de școli generale și a fost
            realizat folosind rezultatele oficiale la examenul de Evaluare
            Națională publicate de Ministerul Educației Naționale.
          </p>
          <p>
            Apăsați pe capetele de tabel pentru a sorta școlile după un anumit
            criteriu.
          </p>
          <p>
            Apăsați pe numele unei școli{judet ? "" : " sau unui județ"} pentru
            a vedea mai multe statistici despre aceasta.
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <LinkSelect defaultValue={an} options={optionsAni} />
            <LinkSelect
              className="w-48"
              defaultValue={judet?.nume ?? ""}
              options={optionsJudete}
            />
          </div>
          <ShareButtons />
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

  queryEn
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

  queryScoli.forEach((scoala) => {
    const obj = scoli[scoala.id_scoala];
    if (obj != undefined) {
      obj.numeScoala = scoala.nume_scoala;
    }
  });

  return Object.values(scoli);
}
