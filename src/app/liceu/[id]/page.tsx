import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import { query } from "~/data/dbQuery";
import { formtaNumber } from "~/data/formatNumber";
import { LinkText } from "~/components/LinkText";
import type { Metadata } from "next";
import { PieChart } from "~/components/PieChart";
import { ChartCard, SnippetCard } from "~/components/Cards";
import { env } from "~/env.mjs";
import { notFound } from "next/navigation";
import { Announcements } from "~/components/Announcements";
import Link from "next/link";
import { TabelSpecializari } from "~/components/tables/TabelSpecializari";
import { TabelDisciplineBac } from "~/components/tables/TabelDisciplineBac";
import { largeIcons } from "~/data/icons";
import { twMerge } from "tailwind-merge";
import { TabelDateIstoriceLiceu } from "~/components/tables/TabelDateIstoriceLiceu";
import { ierarhieLicee } from "~/data/ierarhie";
import { nonBreakableName } from "~/data/nonBreakableName";

export function generateStaticParams() {
  return query.licee.map((e) => ({
    id: e.id_liceu,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const numeLiceu = query.licee.find(
    (e) => e.id_liceu == params.id
  )?.nume_afisat;

  if (!numeLiceu) return {};

  const title = `${numeLiceu}`;
  const description = `Descoperă informații detaliate despre ${numeLiceu}, bazate pe rezultatele oficiale de la examenele de Bacalaureat și Evaluare Națională publicate de Ministerul Educației Naționale.`;

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

export default function PaginaLiceu({
  params: { id },
}: {
  params: { id: string };
}) {
  const {
    numeLiceu,
    gimnaziu,
    website,
    adresa,
    codJudet,
    rezultateBac,
    admitere,
    genderData,
    specializari,
    disciplineBac,
  } = getInfoLiceu(id);

  const dataBac = Object.entries(rezultateBac).at(-1);
  const dataAdm = Object.entries(admitere).at(-1) as [string, number];

  if (!dataBac || !codJudet || !numeLiceu) notFound();

  return (
    <MainContainer>
      <div className="flex w-full flex-col items-center gap-32">
        <div className="mt-12 flex w-full flex-col items-center gap-8">
          {largeIcons[id] && (
            <img
              src={`/icons-lg/${id}.webp`}
              alt={numeLiceu}
              className="mx-auto h-40 w-40"
            />
          )}

          <Title className="!my-0 max-w-full text-xl">
            {nonBreakableName(numeLiceu)}
          </Title>

          {(website || adresa) && (
            <div className="flex flex-col items-center gap-1">
              {website && (
                <LinkText href={website} target="_blank">
                  {new URL(website).hostname}
                </LinkText>
              )}
              {adresa && (
                <i className="w-[16rem] text-center [text-wrap:balance]">
                  {adresa}
                </i>
              )}
            </div>
          )}

          {gimnaziu && (
            <div className="flex w-full justify-center gap-4 pb-2">
              <div className="border-collapse border-b-2 border-black px-1 pb-2 text-center font-semibold">
                Liceu
              </div>
              <Link href={`/scoala/${id}`} replace={true} scroll={false}>
                <div className="border-black px-1 pb-2 text-center tracking-wide hover:border-b-2 hover:font-semibold hover:tracking-normal">
                  Gimnaziu
                </div>
              </Link>
            </div>
          )}
        </div>

        <Announcements />

        <div
          className={twMerge(
            `mx-auto grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-4 sm:gap-x-16`,
            !dataAdm && "sm:grid-cols-3"
          )}
        >
          <SnippetCard
            title={`Medie Bac ${dataBac[0]}`}
            value={formtaNumber(dataBac[1].medie, 2)}
          />
          {dataAdm && (
            <SnippetCard
              title={`Medie Admitere ${dataAdm[0]}`}
              value={formtaNumber(dataAdm[1], 2)}
            />
          )}
          <SnippetCard
            title={`Promovare ${dataBac[0]}`}
            value={formtaNumber(dataBac[1].rataPromovare, 1, 0) + "%"}
          />
          <SnippetCard
            title={`Candidați Bac ${dataBac[0]}`}
            value={formtaNumber(dataBac[1].candidati, 0)}
          />
        </div>

        <TabelDateIstoriceLiceu
          rezultateBac={rezultateBac}
          admitere={admitere}
          ierarhie={ierarhieLicee[id] ?? {}}
        />

        <TabelSpecializari specializari={specializari} />

        <div className="mx-auto my-24 grid gap-x-48 gap-y-32 self-center lg:grid-cols-2">
          <ChartCard title={`Limbi străine Bac ${dataBac[0]}`}>
            <PieChart
              data={Object.entries(dataBac[1].limbiStraine).map(
                ([limba, e]) => ({
                  name: limba,
                  value: e.candidati,
                })
              )}
            />
          </ChartCard>

          <ChartCard title={`Specializări Bac ${dataBac[0]}`}>
            <PieChart
              data={Object.entries(dataBac[1].specializari).map(
                ([specializare, e]) => ({
                  name: specializare,
                  value: e.candidati,
                })
              )}
            />
          </ChartCard>

          <ChartCard title={`Limbi materne Bac ${dataBac[0]}`}>
            <PieChart
              data={Object.entries(dataBac[1].limbiMaterne).map(
                ([limba, e]) => ({
                  name: limba,
                  value: e.candidati,
                })
              )}
            />
          </ChartCard>

          {genderData && (
            <ChartCard title="Demografie elevi">
              <PieChart
                data={[
                  {
                    name: "Masculin",
                    value: genderData.males,
                    color: "rgb(54, 162, 235)",
                  },
                  {
                    name: "Feminin",
                    value: genderData.females,
                    color: "rgb(255, 99, 132)",
                  },
                ]}
                convertToPercentages
              />
            </ChartCard>
          )}
        </div>

        <TabelDisciplineBac discipline={disciplineBac} />
      </div>
    </MainContainer>
  );
}

function getInfoLiceu(id: string) {
  const codJudet = query.bac.find((result) => result.id_liceu == id)?.id_judet;
  const {
    nume_afisat: numeLiceu,
    website,
    address: adresa,
  } = query.licee.find((result) => result.id_liceu == id) || {};

  const gimnaziu = query.scoli.some((result) => result.id_scoala == id);

  const specializari = query.specializariAdm
    .filter((s) => s.repartizat_id_liceu == id)
    .map((s) => ({
      nume: s.repartizat_specializare ?? "",
      admisi: s._count._all,
      medie: s._min.medie_adm,
      an: s.an,
    }));

  const disciplineBac = [
    ...query.bacRomana
      .filter((s) => s.id_liceu == id)
      .map((s) => ({
        nume: "Limba română",
        medie: s._avg.lr_final,
        elevi: s._count._all,
        an: s.an,
      })),
    ...query.bacLimbaMaterna
      .filter((s) => s.id_liceu == id)
      .map((s) => ({
        nume: s.limba_materna ?? "",
        medie: s._avg.lm_final,
        elevi: s._count._all,
        an: s.an,
      })),
    ...query.bacDisciplineObligatorii
      .filter((s) => s.id_liceu == id)
      .map((s) => ({
        nume: s.disciplina_obligatorie,
        medie: s._avg.do_final,
        elevi: s._count._all,
        an: s.an,
      })),
    ...query.bacDisciplineAlegere
      .filter((s) => s.id_liceu == id)
      .map((s) => ({
        nume: s.disciplina_alegere,
        medie: s._avg.do_final,
        elevi: s._count._all,
        an: s.an,
      })),
  ];

  const rezultateBac = {} as {
    [an: number]: {
      medie?: number;
      candidati: number;
      candidatiValizi: number;
      rataPromovare?: number;
      limbiMaterne: {
        [limba: string]: {
          candidati: number;
        };
      };
      limbiStraine: {
        [limba: string]: {
          candidati: number;
        };
      };
      specializari: {
        [specializare: string]: {
          candidati: number;
        };
      };
    };
  };

  const admitere = Object.fromEntries(
    query.mediiAdmLicee
      .filter((result) => result.repartizat_id_liceu == id)
      .sort((a, b) => b.an - a.an)
      .map((e) => [e.an, e._min.medie_adm])
  );

  query.bac
    .filter((result) => result.id_liceu == id)
    .forEach((result) => {
      rezultateBac[result.an] = {
        medie: result._avg.my_medie || undefined,
        candidati: result._count._all,
        candidatiValizi: result._count.my_medie,
        rataPromovare: 0,
        limbiMaterne: {},
        limbiStraine: {},
        specializari: {},
      };
    });

  query.promovatiBac
    .filter((result) => result.id_liceu == id)
    .forEach((result) => {
      const d = rezultateBac[result.an];

      if (d) {
        d.rataPromovare = (result._count._all / d.candidatiValizi) * 100;
      }
    });

  query.limbiMaterneBac
    .filter((result) => result.id_liceu == id)
    .forEach((e) => {
      const d = rezultateBac[e.an];

      if (d) {
        const limba =
          "L" +
          (e.limba_materna || "Limba română")
            .replaceAll(" (REAL)", "")
            .replaceAll(" (UMAN)", "")
            .toLowerCase()
            .slice(1);

        d.limbiMaterne[limba] = {
          candidati: e._count._all,
        };
      }
    });

  query.limbiStraineBac
    .filter((result) => result.id_liceu == id)
    .forEach((e) => {
      const d = rezultateBac[e.an];

      if (d) {
        d.limbiStraine[e.limba_moderna] = {
          candidati: e._count._all,
        };
      }
    });

  query.specializariBac
    .filter((result) => result.id_liceu == id)
    .forEach((e) => {
      const d = rezultateBac[e.an];

      if (d) {
        d.specializari[e.specializare] = {
          candidati: e._count._all,
        };
      }
    });

  const males =
    query.gender.find((e) => e.id_liceu == id && e.sex == "M")?._count._all ||
    null;
  const females =
    query.gender.find((e) => e.id_liceu == id && e.sex == "F")?._count._all ||
    null;

  const genderData =
    males != null && females != null
      ? {
          males,
          females,
        }
      : undefined;

  return {
    numeLiceu,
    gimnaziu,
    website,
    adresa,
    codJudet,
    rezultateBac,
    admitere,
    genderData,
    specializari,
    disciplineBac,
  };
}
