import { Title } from "~/components/Title";
import { JUDETE, judetDupaNume } from "~/data/coduriJudete";
import { query } from "~/data/dbQuery";

import { TabelLicee } from "./TabelLicee";
import { MainContainer } from "~/components/MainContainer";
import { liceuToDataArray } from "~/data/data";
import type { Liceu } from "~/data/data";
import type { Metadata } from "next";
import { ShareButtons } from "~/components/ShareButtons";
import { LinkSelect } from "~/components/LinkSelect";
import { env } from "~/env.mjs";
import { notFound } from "next/navigation";
import { Announcements } from "~/components/Announcements";

export function generateMetadata({
  params,
}: {
  params: { query: string[] };
}): Metadata {
  const [an, numeJudet] = params.query;
  const numeIntregJudet = JUDETE.find((j) => j.nume === numeJudet)?.numeIntreg;

  if (!an) return {};

  const title = numeIntregJudet
    ? `Top licee ${numeIntregJudet} ${an} | Bac Plus`
    : `Top licee ${an} | Bac Plus`;

  const description = `Descoperă cele mai bune licee din ${
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
  return query.aniBac
    .map(({ an }) => an.toString())
    .flatMap((an) => [
      { query: [an] },
      ...JUDETE.map((judet) => ({
        query: [an, judet.nume],
      })),
    ]);
}

export default function Page({ params }: { params: { query: string[] } }) {
  const [an, numeJudet] = params.query;

  if (!an) notFound();

  const judet = numeJudet ? judetDupaNume(numeJudet) : undefined;

  const { licee, anAdmitere } = getLicee(parseInt(an), judet?.id);

  const optionsAni = query.aniBac.map(({ an }) => ({
    value: `${an}`,
    label: `${an}`,
    link: `/top_licee/${an}${judet ? "/" + judet.nume : ""}`,
  }));

  const optionsJudete = [
    {
      value: "",
      label: "Național",
      link: `/top_licee/${an}`,
    },
    ...JUDETE.map((j) => ({
      value: j.nume,
      label: j.numeIntreg,
      link: `/top_licee/${an}/${j.nume}`,
    })),
  ];

  return (
    <>
      <MainContainer>
        <Title>
          Clasamentul liceelor din {judet?.numeIntreg ?? "România"} {an}
        </Title>

        <Announcements />

        <div className="mb-4 flex flex-col gap-4">
          <p>
            Acest clasament conține {licee.length} de licee și a fost realizat
            folosind rezultatele oficiale la examenele de Bacalaureat și
            Evaluare Națională publicate de Ministerul Educației Naționale.
          </p>
          <p>
            Apăsați pe capetele de tabel pentru a sorta liceele după un anumit
            criteriu.
          </p>
          <p>
            Apăsați pe numele unui liceu{judet ? "" : " sau județ"} pentru a
            vedea mai multe statistici despre acesta.
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex gap-4">
            <LinkSelect defaultValue={an} options={optionsAni} />
            <LinkSelect
              className="w-48"
              defaultValue={judet?.nume ?? ""}
              options={optionsJudete}
            />
          </div>
          <ShareButtons />
        </div>
        <TabelLicee
          data={licee.map(liceuToDataArray)}
          anAdmitere={anAdmitere?.an}
        />
      </MainContainer>
    </>
  );
}

function getLicee(an: number, judet?: string) {
  const licee = {} as {
    [id: string]: Liceu;
  };

  query.bac
    .filter(
      (result) =>
        result.an === an && (result.id_judet === judet || judet === undefined)
    )
    .forEach((result) => {
      if (result.id_liceu === null) return;

      licee[result.id_liceu] = {
        id: result.id_liceu,
        medieBac: result._avg.my_medie ?? undefined,
        numCandidati: result._count._all,
        numCandidatiValizi: result._count.my_medie,
        rataPromovare: 0,
        numeLiceu: "",
        codJudet: result.id_liceu.split("_").at(-1) ?? "",
      };
    });

  query.promovatiBac
    .filter((result) => result.an === an)
    .forEach((result) => {
      if (result.id_liceu === null) return;

      const liceu = licee[result.id_liceu];

      if (liceu && liceu.numCandidatiValizi) {
        liceu.rataPromovare = result._count._all / liceu.numCandidatiValizi;
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
      if (result.repartizat_id_liceu === null) return;

      const liceu = licee[result.repartizat_id_liceu];

      if (liceu) {
        liceu.medieAdm = result._min.medie_adm ?? undefined;
      }
    });

  query.licee.forEach((liceu) => {
    const obj = licee[liceu.id_liceu];
    if (obj != undefined) {
      obj.numeLiceu = liceu.nume_liceu;
    }
  });

  return { licee: Object.values(licee), anAdmitere };
}
