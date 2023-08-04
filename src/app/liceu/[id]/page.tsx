import { FaAward, FaUserFriends } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { LuMessagesSquare as TbMessageLanguage } from "react-icons/lu";
import {
  FaPersonCircleCheck,
  FaSchoolCircleCheck,
  FaSuitcase,
  FaUserGraduate,
} from "react-icons/fa6";
import { Chart } from "~/components/client-ports/Chart";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import { query } from "~/data/dbQuery";
import { formtaNumber } from "~/data/formatNumber";
import { ShareButtons } from "~/components/ShareButtons";
import { LinkText } from "~/components/LinkText";
import type { Metadata } from "next";
import { PieChart } from "~/components/PieChart";
import { Card, ChartCard, SnippetCard } from "~/components/Cards";
import { env } from "~/env.mjs";
import { notFound } from "next/navigation";
import { Announcements } from "~/components/Announcements";
import { judetDupaCod } from "~/data/coduriJudete";

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
  )?.nume_liceu;

  if (!numeLiceu) return {};

  const title = `${numeLiceu} | Bac Plus`;
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
    website,
    adresa,
    codJudet,
    rezultateBac,
    admitere,
    genderData,
  } = getInfoLiceu(id);

  const dataBac = Object.entries(rezultateBac).at(-1);
  const dataAdm = Object.entries(admitere).at(-1) as [string, number];

  if (!dataBac || !codJudet) notFound();

  return (
    <MainContainer>
      <Title>{numeLiceu}</Title>

      <Announcements />

      <p>
        Pe această pagină puteți vedea informații despre <b>{numeLiceu}</b> din{" "}
        {judetDupaCod(codJudet).numeIntreg}, bazate pe rezultatele la examenele
        de Bacalaureat și Evaluare Națională publicate de Ministerul Educației
        Naționale.
      </p>
      {(website || adresa) && (
        <p>
          Pentru mai multe informații despre acest liceu, puteți{" "}
          {website && (
            <>
              să accesați site-ul oficial al liceului,{" "}
              <LinkText href={website} target="_blank">
                {new URL(website).hostname}
              </LinkText>
            </>
          )}
          {website && adresa && <>, sau </>}
          {adresa && (
            <>
              să vizitați liceul la adresa <i>{adresa}</i>
            </>
          )}
          .
        </p>
      )}
      <div className="my-4 flex justify-end">
        <ShareButtons />
      </div>

      <div className="flex w-full flex-col items-center gap-4 xl:flex-row">
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:w-fit xl:flex-col">
          <SnippetCard
            title={`Medie Bac ${dataBac[0]}`}
            value={formtaNumber(dataBac[1].medie, 3)}
            Icon={FaAward}
          />
          <SnippetCard
            title={`Promovare ${dataBac[0]}`}
            value={formtaNumber(dataBac[1].rataPromovare, 1) + "%"}
            Icon={FaSchoolCircleCheck}
          />
          <SnippetCard
            title={`Candidați Bac ${dataBac[0]}`}
            value={formtaNumber(dataBac[1].candidati, 3)}
            Icon={FaUserGraduate}
          />
          {dataAdm && (
            <SnippetCard
              title={`Medie Admitere ${dataAdm[0]}`}
              value={formtaNumber(dataAdm[1], 3)}
              Icon={FaPersonCircleCheck}
            />
          )}
        </div>

        <Card className="relative flex w-full flex-col justify-center self-stretch">
          <div className="hidden lg:block">
            <MainChart
              rezultateBac={rezultateBac}
              admitere={admitere}
              aspectRatio={1.87}
            />
          </div>
          <div className="lg:hidden">
            <MainChart
              rezultateBac={rezultateBac}
              admitere={admitere}
              aspectRatio={1}
            />
          </div>
        </Card>
      </div>

      <div className="mt-1 grid w-full gap-4 self-center overflow-hidden lg:grid-cols-2">
        <ChartCard
          title={`Distribuție limbi străine ${dataBac[0]}`}
          Icon={IoLanguage}
        >
          <PieChart
            data={Object.entries(dataBac[1].limbiStraine).map(([limba, e]) => ({
              name: limba,
              value: e.candidati,
            }))}
            aspectRatio={1.7}
          />
        </ChartCard>

        <ChartCard
          title={`Distribuție specializări ${dataBac[0]}`}
          Icon={FaSuitcase}
        >
          <PieChart
            data={Object.entries(dataBac[1].specializari).map(
              ([specializare, e]) => ({
                name: specializare,
                value: e.candidati,
              })
            )}
            aspectRatio={1.7}
          />
        </ChartCard>

        <ChartCard
          title={`Distribuție limbi materne ${dataBac[0]}`}
          Icon={TbMessageLanguage}
        >
          <PieChart
            data={Object.entries(dataBac[1].limbiMaterne).map(([limba, e]) => ({
              name: limba,
              value: e.candidati,
            }))}
            aspectRatio={1.7}
          />
        </ChartCard>

        {genderData && (
          <ChartCard title="Distribuție demografică elevi" Icon={FaUserFriends}>
            <PieChart
              data={[
                {
                  name: "M",
                  value: genderData.males,
                  color: "rgb(54, 162, 235)",
                },
                {
                  name: "F",
                  value: genderData.females,
                  color: "rgb(255, 99, 132)",
                },
              ]}
              aspectRatio={1.7}
              convertToPercentages
            />
          </ChartCard>
        )}
      </div>
    </MainContainer>
  );
}

function getInfoLiceu(id: string) {
  const codJudet = query.bac.find((result) => result.id_liceu == id)?.id_judet;
  const {
    nume_liceu: numeLiceu,
    website,
    address: adresa,
  } = query.licee.find((result) => result.id_liceu == id) || {};

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
    website,
    adresa,
    codJudet,
    rezultateBac,
    admitere,
    genderData,
  };
}

function MainChart({
  rezultateBac: data,
  admitere: dataAdm,
  aspectRatio,
}: {
  rezultateBac: {
    [an: string]: {
      medie?: number;
      candidati: number;
      candidatiValizi: number;
      rataPromovare?: number;
    };
  };
  admitere: {
    [an: string]: number | null;
  };
  aspectRatio: number;
}) {
  const entries = Object.entries(data).sort();

  const chartData = {
    labels: entries.map((e) => e[0]),
    datasets: [
      {
        label: "Medie absolvire",
        data: entries.map((e) => e[1].medie),
        fill: false,
        backgroundColor: "#FD8A8A",
        borderColor: "#FD8A8A",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Medie admitere",
        data: entries.map((e) => dataAdm[e[0]]),
        fill: false,
        backgroundColor: "#FDAD35",
        borderColor: "#FDAD35",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Candidați Bac",
        data: entries.map((e) => e[1].candidati),
        fill: false,
        borderColor: "#9EA1D4",
        backgroundColor: "#9EA1D4",
        tension: 0.4,
        yAxisID: "y1",
      },
      {
        label: "Rata de promovare",
        data: entries.map((e) => e[1].rataPromovare),
        fill: false,
        backgroundColor: "#A8D1D1",
        borderColor: "#A8D1D1",
        tension: 0.4,
        yAxisID: "y2",
      },
    ],
  };
  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#000",
        },
      },
    },
    aspectRatio: aspectRatio,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          color: "#555",
        },
        grid: {
          color: "#bbb",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        max: 10,

        ticks: {
          color: "#f75",
        },
        grid: {
          color: "#bbb",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",

        ticks: {
          color: "#7E81D4",
          precision: 0,
        },

        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
      y2: {
        type: "linear",
        display: false,
        min: 0,
        max: 102,

        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  };

  return <Chart type="line" data={chartData} options={chartOptions} />;
}
