import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import {
  institutii,
  institutiiBac,
  institutiiEn,
  licee,
  query,
} from "~/data/dbQuery";
import { formtaNumber } from "~/data/formatNumber";
import { LinkText } from "~/components/LinkText";
import type { Metadata } from "next";
import { PieChart } from "~/components/PieChart";
import { ChartCard, SnippetCard } from "~/components/Cards";
import { env } from "~/env.js";
import { notFound } from "next/navigation";
import { Announcements } from "~/components/Announcements";
import Link from "next/link";
import { TabelSpecializari } from "~/components/tables/TabelSpecializari";
import { TabelDisciplineBac } from "~/components/tables/TabelDisciplineBac";
import { twMerge } from "tailwind-merge";
import { TabelDateIstoriceLiceu } from "~/components/tables/TabelDateIstoriceLiceu";
import { ierarhieLicee, ierarhieScoli } from "~/data/ierarhie";
import { nonBreakableName } from "~/data/nonBreakableName";
import { getIdFromUrl, getUrlFromId } from "~/data/institutie/urlFromId";
import { TabelDateIstoriceScoala } from "~/components/tables/TabelDateIstoriceScoala";
import { FaMapMarkerAlt } from "react-icons/fa";
import { capitalize } from "~/data/capitalize";
import {
  type RezultateBacClase,
  TabelRezultateBacClase,
} from "~/components/tables/TabelRezultateBacClase";

export function generateStaticParams() {
  return [];
  return query.institutii.flatMap((i) =>
    institutiiBac.has(i.cod_siiir) && institutiiEn.has(i.cod_siiir)
      ? [
          {
            query: [getUrlFromId(i.cod_siiir)],
          },
          {
            query: [getUrlFromId(i.cod_siiir), "gimnaziu"],
          },
        ]
      : [
          {
            query: [getUrlFromId(i.cod_siiir)],
          },
        ]
  );
}

export function generateMetadata({
  params,
}: {
  params: { query: [string, string?] };
}): Metadata {
  const [urlId, gimnaziu] = params.query;
  const id = getIdFromUrl(urlId);

  if (!id) return {};

  const institutie = query.institutii.find((i) => i.cod_siiir == id);

  if (!institutie) return {};

  const title =
    institutie.nume +
    " – " +
    (institutiiBac.has(institutie.cod_siiir) && !gimnaziu
      ? "Admitere, Bac, rezultate, informații"
      : "Evaluare Națională, rezultate, informații");
  const description = `Descoperă informații detaliate despre ${institutie.nume}, bazate pe rezultatele oficiale de la examenele de Bacalaureat și Evaluare Națională publicate de Ministerul Educației Naționale.`;

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
  };
}

export default function PaginaInstitutie({
  params: {
    query: [idUrl, gimnaziu],
  },
}: {
  params: { query: [string, string?] };
}) {
  const siiir = getIdFromUrl(idUrl);

  if (!siiir) notFound();

  const institutie = institutii[siiir];

  if (!institutie) notFound();

  return (
    <MainContainer>
      <div className="flex w-full flex-col items-center gap-32">
        <div className="mt-12 flex w-full flex-col items-center gap-8 ">
          {institutie.sigla_lg && (
            <img
              src={`https://assets.bacplus.ro/institutii/${institutie.cod_siiir}/sigla-lg.webp`}
              alt={institutie.nume}
              className="mx-auto h-40 w-40"
            />
          )}

          <Title className="!my-0">{nonBreakableName(institutie.nume)}</Title>

          {(institutie.website || institutie.adresa) && (
            <div className="flex flex-col items-center gap-1">
              {institutie.website && (
                <LinkText href={institutie.website} target="_blank">
                  {new URL(institutie.website).hostname}
                </LinkText>
              )}
              {institutie.adresa && (
                <>
                  <i className="w-[16rem] text-center [text-wrap:balance]">
                    {institutie.adresa}
                  </i>
                  {institutie.latlong && (
                    <LinkText
                      href={`/harta?lat=${
                        institutie.latlong.split(",")[0] || ""
                      }&long=${institutie.latlong.split(",")[1] || ""}`}
                      target="_blank"
                    >
                      <FaMapMarkerAlt className="mr-1 mt-[-2px] inline" />
                      Vezi pe hartă
                    </LinkText>
                  )}
                </>
              )}
            </div>
          )}

          {institutiiBac.has(siiir) && institutiiEn.has(siiir) && (
            <div className="flex w-full select-none justify-center gap-4 pb-2">
              {gimnaziu ? (
                <Link
                  href={`/i/${getUrlFromId(siiir)}`}
                  replace={true}
                  scroll={false}
                >
                  <div className="border-black px-1 pb-2 text-center tracking-wide hover:border-b-2 hover:font-semibold hover:tracking-normal">
                    Liceu
                  </div>
                </Link>
              ) : (
                <div className="border-collapse border-b-2 border-black px-1 pb-2 text-center font-semibold">
                  Liceu
                </div>
              )}
              {!gimnaziu ? (
                <Link
                  href={`/i/${getUrlFromId(siiir)}/gimnaziu`}
                  replace={true}
                  scroll={false}
                >
                  <div className="border-black px-1 pb-2 text-center tracking-wide hover:border-b-2 hover:font-semibold hover:tracking-normal">
                    Gimnaziu
                  </div>
                </Link>
              ) : (
                <div className="border-collapse border-b-2 border-black px-1 pb-2 text-center font-semibold">
                  Gimnaziu
                </div>
              )}
            </div>
          )}
        </div>

        <Announcements />

        {gimnaziu || !institutiiBac.has(siiir) ? (
          <PaginaGimnaziu id={siiir} />
        ) : (
          <PaginaLiceu id={siiir} />
        )}
      </div>
    </MainContainer>
  );
}

function PaginaGimnaziu({ id }: { id: string }) {
  const { numeScoala, rezultateEn, genderData } = getInfoScoala(id);

  const data = Object.entries(rezultateEn).at(-1);

  if (!data || !numeScoala) notFound();

  return (
    <>
      <div className="mx-auto grid grid-cols-[8rem_8rem] items-center gap-x-4 gap-y-8 sm:grid-cols-[repeat(4,8rem)] sm:gap-x-8">
        <SnippetCard
          title={`Evaluare ${data[0]}`}
          value={formtaNumber(data[1].medieEvaluareNationala, 2)}
        />
        <SnippetCard
          title={`Română ${data[0]}`}
          value={formtaNumber(data[1].medieLimbaRomana, 2)}
        />
        <SnippetCard
          title={`Matematică ${data[0]}`}
          value={formtaNumber(data[1].medieMatematica, 2)}
        />
        <SnippetCard
          title={`Absolvenți ${data[0]}`}
          value={formtaNumber(data[1].candidati, 0)}
        />
      </div>

      <TabelDateIstoriceScoala
        rezultateEn={rezultateEn}
        ierarhie={ierarhieScoli[id] ?? {}}
      />

      <div className="flex flex-col items-center justify-center gap-16 sm:flex-row">
        {(Object.keys(data[1].limbiMaterne).length > 1 ||
          (Object.keys(data[1].limbiMaterne).length == 1 &&
            Object.keys(data[1].limbiMaterne)[0] != "Limba română")) && (
          <ChartCard title={`Limbi materne ${data[0]}`}>
            <PieChart
              data={Object.entries(data[1].limbiMaterne).map(([limba, e]) => ({
                name: limba,
                value: e.candidati,
              }))}
            />
          </ChartCard>
        )}

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
    </>
  );
}

function getInfoScoala(siiir: string) {
  const scoala = institutii[siiir];

  if (!scoala) notFound();

  const rezultateEn = {} as {
    [an: number]: {
      medieEvaluareNationala?: number;
      medieLimbaRomana?: number;
      medieMatematica?: number;
      medieLimbaMaterna?: number;
      medieAbsolvire?: number;
      candidati: number;
      limbiMaterne: {
        [limba: string]: {
          candidati: number;
        };
      };
    };
  };

  query.en.forEach((result) => {
    if (result.unitate_siiir != siiir) return;

    rezultateEn[result.an] = {
      medieEvaluareNationala: result._avg.medie_en?.toNumber(),
      medieLimbaRomana: result._avg.lr_final?.toNumber(),
      medieMatematica: result._avg.ma_final?.toNumber(),
      medieLimbaMaterna: result._avg.lm_final?.toNumber(),
      medieAbsolvire: result._avg.medie_abs?.toNumber(),
      candidati: result._count._all,
      limbiMaterne: {},
    };
  });

  query.limbiMaterneEn.forEach((result) => {
    if (result.unitate_siiir != siiir) return;

    const obj = rezultateEn[result.an];
    if (obj != undefined) {
      obj.limbiMaterne[result.limba_materna || "Limba română"] = {
        candidati: result._count._all,
      };
    }
  });

  const males =
    query.gender.find((e) => e.unitate_siiir == siiir && e.sex == "m")?._count
      ._all || null;
  const females =
    query.gender.find((e) => e.unitate_siiir == siiir && e.sex == "f")?._count
      ._all || null;

  const genderData =
    males != null && females != null
      ? {
          males,
          females,
        }
      : undefined;

  return {
    liceu: institutiiBac.has(siiir),
    rezultateEn,
    numeScoala: scoala?.nume,
    website: scoala?.website,
    address: scoala?.adresa,
    genderData,
  };
}

function PaginaLiceu({ id }: { id: string }) {
  const {
    numeLiceu,
    rezultateBac,
    admitere,
    genderData,
    specializari,
    disciplineBac,
    rezultateClase,
  } = getInfoLiceu(id);

  const dataBac = Object.entries(rezultateBac).at(-1);
  const dataAdm = Object.entries(admitere).at(-1) as [string, number];

  if (!dataBac || !numeLiceu) notFound();

  return (
    <>
      <div
        className={twMerge(
          `mx-auto grid grid-cols-[8rem_8rem] items-center gap-x-4 gap-y-8 sm:grid-cols-[repeat(4,8rem)] sm:gap-x-8`,
          !dataAdm && "sm:grid-cols-3"
        )}
      >
        <SnippetCard
          title={`Medie Bac ${dataBac[0]}`}
          value={formtaNumber(dataBac[1].medie, 2)}
        />
        {dataAdm && (
          <SnippetCard
            title={`Admitere ${dataAdm[0]}`}
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

      <div className="mx-auto mb-16 mt-8 grid gap-x-48 gap-y-24 self-center lg:grid-cols-2">
        <ChartCard title={`Limbi străine Bac ${dataBac[0]}`}>
          <PieChart
            data={Object.entries(dataBac[1].limbiStraine).map(([limba, e]) => ({
              name: limba,
              value: e.candidati,
            }))}
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
            data={Object.entries(dataBac[1].limbiMaterne).map(([limba, e]) => ({
              name: limba,
              value: e.candidati,
            }))}
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

      <TabelRezultateBacClase rezultate={rezultateClase} />
    </>
  );
}

function getInfoLiceu(siiir: string) {
  const { nume: numeLiceu, website, adresa } = institutii[siiir] || {};

  const gimnaziu = institutiiEn.has(siiir);

  const specializari = query.specializariAdm
    .filter((s) => s.repartizat_liceu_siiir == siiir)
    .map((s) => ({
      nume: s.repartizat_specializare ?? "",
      admisi: s._count._all,
      medie: s._min.medie_adm?.toNumber(),
      an: s.an,
    }));

  const disciplineBac = [
    ...query.bacRomana
      .filter((s) => s.unitate_siiir == siiir)
      .map((s) => ({
        nume: "Limba română",
        medie: s._avg.lr_final?.toNumber(),
        elevi: s._count._all,
        an: s.an,
      })),
    ...query.bacLimbaMaterna
      .filter((s) => s.unitate_siiir == siiir)
      .map((s) => ({
        nume: s.limba_materna ?? "",
        medie: s._avg.lm_final?.toNumber(),
        elevi: s._count._all,
        an: s.an,
      })),
    ...query.bacDisciplineObligatorii
      .filter((s) => s.unitate_siiir == siiir)
      .map((s) => ({
        nume: capitalize(s.disciplina_obligatorie),
        medie: s._avg.do_final?.toNumber(),
        elevi: s._count._all,
        an: s.an,
      })),
    ...query.bacDisciplineAlegere
      .filter((s) => s.unitate_siiir == siiir)
      .map((s) => ({
        nume: capitalize(s.disciplina_alegere),
        medie: s._avg.da_final?.toNumber(),
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
      .filter((result) => result.repartizat_liceu_siiir == siiir)
      .sort((a, b) => b.an - a.an)
      .map((e) => [e.an, e._min.medie_adm?.toNumber()])
  );

  query.bac
    .filter((result) => result.unitate_siiir == siiir)
    .forEach((result) => {
      rezultateBac[result.an] = {
        medie: result._avg.medie?.toNumber() || undefined,
        candidati: result._count._all,
        candidatiValizi: result._count.medie,
        rataPromovare: 0,
        limbiMaterne: {},
        limbiStraine: {},
        specializari: {},
      };
    });

  query.promovatiBac
    .filter((result) => result.unitate_siiir == siiir)
    .forEach((result) => {
      const d = rezultateBac[result.an];

      if (d) {
        d.rataPromovare = (result._count._all / d.candidatiValizi) * 100;
      }
    });

  query.limbiMaterneBac
    .filter((result) => result.unitate_siiir == siiir)
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
    .filter((result) => result.unitate_siiir == siiir)
    .forEach((e) => {
      const d = rezultateBac[e.an];

      if (d) {
        const limba = "L" + e.limba_moderna.toLowerCase().slice(1);

        d.limbiStraine[limba] = {
          candidati: e._count._all,
        };
      }
    });

  query.specializariBac
    .filter((result) => result.unitate_siiir == siiir)
    .forEach((e) => {
      const d = rezultateBac[e.an];

      if (d) {
        d.specializari[capitalize(e.specializare)] = {
          candidati: e._count._all,
        };
      }
    });

  const males =
    query.gender.find((e) => e.unitate_siiir == siiir && e.sex == "m")?._count
      ._all || null;
  const females =
    query.gender.find((e) => e.unitate_siiir == siiir && e.sex == "f")?._count
      ._all || null;

  const genderData =
    males != null && females != null
      ? {
          males,
          females,
        }
      : undefined;

  const rezultateClase = {} as RezultateBacClase;

  query.bacMedieClase
    .filter((r) => r.unitate_siiir == siiir)
    .forEach((r) => {
      const an = r.an;
      const medie = r._avg.medie?.toNumber();
      const candidati = r._count._all;
      const clasa = r.clasa;

      if (!clasa || !medie) return;

      const rezAn = (rezultateClase[an] = rezultateClase[an] || {
        discipline: {},
        clase: {},
      });
      const rezClasa = (rezAn.clase[clasa] = rezAn.clase[clasa] || {});

      rezAn.discipline["Medie generală"] = true;
      rezClasa["Medie generală"] = {
        medie,
        candidati,
      };
    });

  query.bacRomanaClase
    .filter((r) => r.unitate_siiir == siiir)
    .forEach((r) => {
      const an = r.an;
      const medie = r._avg.lr_final?.toNumber();
      const candidati = r._count._all;
      const clasa = r.clasa;

      if (!clasa || !medie) return;

      const rezAn = (rezultateClase[an] = rezultateClase[an] || {
        discipline: {},
        clase: {},
      });
      const rezClasa = (rezAn.clase[clasa] = rezAn.clase[clasa] || {});

      rezAn.discipline["Limba română"] = true;
      rezClasa["Limba română"] = {
        medie,
        candidati,
      };
    });

  query.bacLimbaMaternaClase
    .filter((r) => r.unitate_siiir == siiir)
    .forEach((r) => {
      const an = r.an;
      const medie = r._avg.lm_final?.toNumber();
      const candidati = r._count._all;
      const clasa = r.clasa;
      const limba = r.limba_materna;

      if (!clasa || !medie || !limba) return;

      const rezAn = (rezultateClase[an] = rezultateClase[an] || {
        discipline: {},
        clase: {},
      });
      const rezClasa = (rezAn.clase[clasa] = rezAn.clase[clasa] || {});

      rezAn.discipline[limba] = true;
      rezClasa[limba] = {
        medie,
        candidati,
      };
    });

  query.bacDisciplineAlegereClase
    .filter((r) => r.unitate_siiir == siiir)
    .forEach((r) => {
      const an = r.an;
      const medie = r._avg.da_final?.toNumber();
      const candidati = r._count._all;
      const clasa = r.clasa;
      const disciplina = r.disciplina_alegere;

      if (!clasa || !medie || !disciplina) return;

      const rezAn = (rezultateClase[an] = rezultateClase[an] || {
        discipline: {},
        clase: {},
      });
      const rezClasa = (rezAn.clase[clasa] = rezAn.clase[clasa] || {});

      rezAn.discipline[disciplina] = true;
      rezClasa[disciplina] = {
        medie,
        candidati,
      };
    });

  query.bacDisciplineObligatoriiClase
    .filter((r) => r.unitate_siiir == siiir)
    .forEach((r) => {
      const an = r.an;
      const medie = r._avg.do_final?.toNumber();
      const candidati = r._count._all;
      const clasa = r.clasa;
      const disciplina = r.disciplina_obligatorie;

      if (!clasa || !medie || !disciplina) return;

      const rezAn = (rezultateClase[an] = rezultateClase[an] || {
        discipline: {},
        clase: {},
      });
      const rezClasa = (rezAn.clase[clasa] = rezAn.clase[clasa] || {});

      rezAn.discipline[disciplina] = true;
      rezClasa[disciplina] = {
        medie,
        candidati,
      };
    });

  return {
    numeLiceu,
    gimnaziu: !!gimnaziu,
    website,
    adresa,
    rezultateBac,
    admitere,
    genderData,
    specializari,
    disciplineBac,
    rezultateClase,
  };
}
