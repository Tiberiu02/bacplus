import { Title } from "~/components/Title";
import { JUDETE } from "~/data/coduriJudete";
import { query, ultimulAnBac } from "~/data/dbQuery";

import { TabelLicee } from "../../../components/tables/TabelLicee";
import { MainContainer } from "~/components/MainContainer";
import { liceuToDataArray } from "~/data/data";
import type { Liceu } from "~/data/data";
import type { Metadata } from "next";
import { LinkSelect } from "~/components/LinkSelect";
import { env } from "~/env.mjs";
import { Announcements } from "~/components/Announcements";
import { LdJson } from "~/components/LdJson";
import { parseParamsTop } from "~/data/parseParamsTop";
import { redirect } from "next/navigation";
import { smallIcons } from "~/data/icons";

export function generateMetadata({
  params,
}: {
  params: { query: string[] };
}): Metadata {
  const [an, judet] = parseParamsTop(params.query, ultimulAnBac);

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
      images: ["/og-banner.jpg"],
      url: env.WEBSITE_URL,
    },
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

export default function Page({ params }: { params: { query: string[] } }) {
  const [an, judet, reversed] = parseParamsTop(params.query, ultimulAnBac);

  if (reversed) {
    redirect(
      "/top_licee" +
        (judet ? "/" + judet.nume : "") +
        (an == ultimulAnBac ? "" : "/" + an.toString())
    );
  }

  const { licee, anAdmitere } = getLicee(an, judet?.id);

  const optionsAni = query.aniBac.map(({ an }) => ({
    value: `${an}`,
    label: `${an}`,
    link:
      "/top_licee" +
      (judet ? "/" + judet.nume : "") +
      (an == ultimulAnBac ? "" : "/" + an.toString()),
  }));

  const optionsJudete = [
    {
      value: "",
      label: "Toate județele",
      link: an == ultimulAnBac ? "/top_licee" : `/top_licee/${an}`,
    },
    ...JUDETE.map((j) => ({
      value: j.nume,
      label: j.numeIntreg,
      link:
        an == ultimulAnBac
          ? `/top_licee/${j.nume}`
          : `/top_licee/${j.nume}/${an}`,
    })),
  ];

  return (
    <>
      <LdJson
        name={
          judet?.numeIntreg
            ? `Top licee ${judet?.numeIntreg} ${an}`
            : `Top licee ${an}`
        }
        description={`Descoperă cele mai bune licee din ${
          judet?.numeIntreg ?? "România"
        } conform rezultatelor oficiale la examenele de Bacalaureat și Evauare Națională ${an} publicate de Ministerul Educației Naționale.`}
        data={licee
          .filter((a) => a.medieBac)
          .sort((a, b) =>
            a.medieBac && b.medieBac ? b.medieBac - a.medieBac : 0
          )
          .slice(0, 10)}
        id={(liceu: Liceu) => liceu.id}
        columns={[
          {
            name: "Nume liceu",
            value: (liceu: Liceu) => liceu.numeLiceu,
            type: "string",
          },
          {
            name: "Medie Bac",
            value: (liceu: Liceu) =>
              liceu.medieBac
                ? Math.round(liceu.medieBac * 100) / 100
                : undefined,
            type: "decimal",
          },
          {
            name: "Rată de promovare",
            value: (liceu: Liceu) =>
              Math.round(liceu.rataPromovare * 100) / 100,
            type: "decimal",
          },
          {
            name: "Elevi",
            value: (liceu: Liceu) => liceu.numCandidati,
            type: "integer",
          },
        ]}
      />

      <MainContainer>
        <Title>
          Clasamentul liceelor {judet && `din ${judet.numeIntreg}`} la
          Bacalaureat și Admitere
        </Title>

        <Announcements />

        <div className="flex flex-wrap-reverse justify-between gap-4">
          <LinkSelect
            defaultValue={judet?.nume ?? ""}
            options={optionsJudete}
            ariaLabel="Selectează județul"
            className="w-48 flex-shrink-0"
          />
          <LinkSelect
            defaultValue={an}
            options={optionsAni}
            ariaLabel="Selectează anul"
            className="w-fit shrink-0"
          />
        </div>

        <TabelLicee
          data={licee.map(liceuToDataArray)}
          anAdmitere={anAdmitere?.an != +an ? anAdmitere?.an : undefined}
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
        icon: smallIcons[result.id_liceu] ?? false,
      };
    });

  query.promovatiBac
    .filter((result) => result.an === an)
    .forEach((result) => {
      if (result.id_liceu === null) return;

      const liceu = licee[result.id_liceu];

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
      if (result.repartizat_id_liceu === null) return;

      const liceu = licee[result.repartizat_id_liceu];

      if (liceu) {
        liceu.medieAdm = result._min.medie_adm ?? undefined;
      }
    });

  query.licee.forEach((liceu) => {
    const obj = licee[liceu.id_liceu];
    if (obj != undefined) {
      obj.numeLiceu = liceu.nume_afisat;
    }
  });

  return { licee: Object.values(licee), anAdmitere };
}
