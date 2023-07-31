import { FaAward, FaUserFriends } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { LuMessagesSquare as TbMessageLanguage } from "react-icons/lu";
import {
  FaPersonCircleCheck,
  FaSchoolCircleCheck,
  FaSuitcase,
  FaUserGraduate,
} from "react-icons/fa6";
import type { IconType } from "react-icons/lib";
import { Chart } from "~/components/client-ports/Chart";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import {
  queryBac,
  queryGender,
  queryLicee,
  queryLimbiMaterneBac,
  queryLimbiStraineBac,
  queryMediiAdmLicee,
  queryPromovatiBac,
  querySpecializariBac,
} from "~/data/dbQuery";
import { formtaNumber } from "~/data/formatNumber";
import { ShareButtons } from "~/components/ShareButtons";
import { JUDETE_MAP } from "~/data/coduriJudete";
import { LinkText } from "~/components/LinkText";
import { colorFromStr } from "~/data/colorFromStr";
import { twMerge } from "tailwind-merge";
import type { PropsWithChildren } from "react";

export function generateStaticParams() {
  return queryLicee.map((e) => ({
    params: {
      id: e.id_liceu,
    },
  }));
}

function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={twMerge("rounded bg-gray-100 p-4 py-3 shadow", className)}>
      {children}
    </div>
  );
}

function SnippetCard({
  title,
  value,
  Icon,
}: {
  title: string;
  value: string;
  Icon: IconType;
}) {
  return (
    <Card className="flex items-center gap-3">
      <Icon className="shrink-0 text-5xl text-blue-500 opacity-60" />
      <div className="mx-auto flex flex-col items-center gap-1 p-1">
        <div className="whitespace-nowrap text-xs font-bold opacity-50">
          {title}
        </div>
        <div className="text-4xl font-bold">{value}</div>
      </div>
    </Card>
  );
}

function ChartCard({
  title,
  Icon,
  children,
}: PropsWithChildren<{
  title: string;
  Icon: IconType;
}>) {
  return (
    <Card className="flex w-full flex-col gap-5">
      <div className="flex items-center gap-3 text-xl font-semibold">
        <Icon className="shrink-0 text-3xl text-blue-500 opacity-60" />
        <div className="opacity-90">{title}</div>
      </div>
      {children}
    </Card>
  );
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

  if (!dataBac || !codJudet) return <div>404</div>;

  return (
    <MainContainer>
      <Title>{numeLiceu}</Title>
      <p>
        Pe această pagină puteți vedea informații despre <b>{numeLiceu}</b> din{" "}
        {JUDETE_MAP[codJudet]?.numeIntreg}, sintetizate folosind rezultatele de
        la examenele de Bacalaureat și Evaluare Națională publicate de
        Ministerul Educației.
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
      <div className="flex justify-end">
        <ShareButtons />
      </div>
      <div className="flex w-full gap-4">
        <div className="flex w-fit flex-col gap-4">
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
            title={`Absolvenți ${dataBac[0]}`}
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

        <Card className="flex w-full flex-col justify-center self-stretch">
          <MainChart rezultateBac={rezultateBac} admitere={admitere} />
        </Card>
      </div>

      <div className="mt-1 grid w-full grid-cols-2 gap-4 self-center">
        <ChartCard
          title={`Distribuție limbi străine ${dataBac[0]}`}
          Icon={IoLanguage}
        >
          <Chart
            type="pie"
            data={{
              labels: Object.keys(dataBac[1].limbiStraine),
              datasets: [
                {
                  data: Object.values(dataBac[1].limbiStraine).map(
                    (e) => e.candidati
                  ),
                  backgroundColor: Object.keys(dataBac[1].limbiStraine).map(
                    colorFromStr
                  ),
                },
              ],
            }}
            options={{
              aspectRatio: 3,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </ChartCard>

        <ChartCard
          title={`Distribuție specializări ${dataBac[0]}`}
          Icon={FaSuitcase}
        >
          <Chart
            type="pie"
            data={{
              labels: Object.keys(dataBac[1].specializari),
              datasets: [
                {
                  data: Object.values(dataBac[1].specializari).map(
                    (e) => e.candidati
                  ),
                  backgroundColor: Object.keys(dataBac[1].specializari).map(
                    colorFromStr
                  ),
                },
              ],
            }}
            options={{
              aspectRatio: 3,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </ChartCard>

        <ChartCard
          title={`Distribuție limbi materne ${dataBac[0]}`}
          Icon={TbMessageLanguage}
        >
          <Chart
            type="pie"
            data={{
              labels: Object.keys(dataBac[1].limbiMaterne),
              datasets: [
                {
                  data: Object.values(dataBac[1].limbiMaterne).map(
                    (e) => e.candidati
                  ),
                  backgroundColor: Object.keys(dataBac[1].limbiMaterne).map(
                    colorFromStr
                  ),
                },
              ],
            }}
            options={{
              aspectRatio: 3,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </ChartCard>

        {genderData && (
          <ChartCard title="Distribuție demografică elevi" Icon={FaUserFriends}>
            <Chart
              type="pie"
              data={{
                labels: ["M", "F"],
                datasets: [
                  {
                    data: [
                      (genderData.males /
                        (genderData.males + genderData.females)) *
                        100,
                      (genderData.females /
                        (genderData.males + genderData.females)) *
                        100,
                    ],
                    backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"],
                  },
                ],
              }}
              options={{
                aspectRatio: 3,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </ChartCard>
        )}
      </div>
    </MainContainer>
  );
}

function getInfoLiceu(id: string) {
  const codJudet = queryBac.find((result) => result.id_liceu == id)?.id_judet;
  const {
    nume_liceu: numeLiceu,
    website,
    address: adresa,
  } = queryLicee.find((result) => result.id_liceu == id) || {};

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
    queryMediiAdmLicee
      .filter((result) => result.repartizat_id_liceu == id)
      .sort((a, b) => b.an - a.an)
      .map((e) => [e.an, e._min.medie_adm])
  );

  queryBac
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

  queryPromovatiBac
    .filter((result) => result.id_liceu == id)
    .forEach((result) => {
      const d = rezultateBac[result.an];

      if (d) {
        d.rataPromovare = (result._count._all / d.candidatiValizi) * 100;
      }
    });

  queryLimbiMaterneBac
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

  queryLimbiStraineBac
    .filter((result) => result.id_liceu == id)
    .forEach((e) => {
      const d = rezultateBac[e.an];

      if (d) {
        d.limbiStraine[e.limba_moderna] = {
          candidati: e._count._all,
        };
      }
    });

  querySpecializariBac
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
    queryGender.find((e) => e.id_liceu == id && e.sex == "M")?._count._all ||
    null;
  const females =
    queryGender.find((e) => e.id_liceu == id && e.sex == "F")?._count._all ||
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
        label: "Absolvenți",
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
    aspectRatio: 1.85,
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
