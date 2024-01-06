import { FaAward, FaGraduationCap } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { LuMessagesSquare as TbMessageLanguage } from "react-icons/lu";
import {
  FaChartSimple,
  FaPersonCircleCheck,
  FaSchoolCircleCheck,
  FaUserGraduate,
} from "react-icons/fa6";
import { Chart } from "~/components/client-ports/Chart";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import { query, ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";
import { formtaNumber } from "~/data/formatNumber";
import { JUDETE, judetDupaNume } from "~/data/coduriJudete";
import type { Metadata } from "next";
import { PieChart } from "~/components/PieChart";
import { Card, ChartCard, SnippetCard } from "~/components/Cards";
import { notFound } from "next/navigation";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { buttonClassName } from "~/components/Button";

export function generateStaticParams() {
  return JUDETE.map((judet) => ({
    id: judet.nume,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const numeJudet = judetDupaNume(params.id).numeIntreg;

  if (!numeJudet) return {};

  return {
    title: `${numeJudet} | Bac Plus`,
    description: `Vezi informații detaliate despre județul ${numeJudet}, bazate pe rezultatele oficiale de la examenele de Bacalaureat și Evaluare Națională publicate de Ministerul Educației Naționale.`,
  };
}

export default function PaginaJudet({
  params: { id },
}: {
  params: { id: string };
}) {
  const { numeJudet, rezultateBac } = getInfoJudet(id);

  const dataBac = Object.entries(rezultateBac).at(-1);
  const dataAdm = Object.entries(rezultateBac)
    .filter((e) => e[1].medieEn)
    .at(-1);

  if (!dataBac) notFound();

  return (
    <MainContainer>
      <Title>{numeJudet}</Title>

      <p>
        Pe această pagină puteți vedea informații despre județul {numeJudet},
        bazate pe rezultatele oficiale la examenele de Bacalaureat și Evaluare
        Națională publicate de Ministerul Educației Naționale.
      </p>

      <div className="mt-4" />

      <div className="flex w-full gap-4 max-md:flex-col">
        <Link
          href={`/top_licee/${ultimulAnBac}/${id}`}
          className={twMerge(
            buttonClassName,
            "flex w-full items-center justify-center gap-3"
          )}
        >
          <FaGraduationCap className="text-xl text-blue-500" />
          Top licee {numeJudet} {ultimulAnBac}
        </Link>
        <Link
          href={`/top_scoli/${ultimulAnEn}/${id}`}
          className={twMerge(
            buttonClassName,
            "flex w-full items-center justify-center gap-3"
          )}
        >
          <FaChartSimple className="text-xl text-blue-500" />
          Top școli {numeJudet} {ultimulAnEn}
        </Link>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 self-center sm:grid-cols-2 sm:grid-rows-[audo_auto_auto] lg:grid-cols-4 lg:grid-rows-[auto_auto] xl:grid-flow-col xl:grid-cols-[auto_1fr] xl:grid-rows-4">
        <SnippetCard
          title={`Medie Bac ${dataBac[0]}`}
          value={formtaNumber(dataBac[1].medie, 2)}
          Icon={FaAward}
        />
        <SnippetCard
          title={`Promovare Bac ${dataBac[0]}`}
          value={formtaNumber(dataBac[1].rataPromovare, 1) + "%"}
          Icon={FaSchoolCircleCheck}
        />
        <SnippetCard
          title={`Candidați Bac ${dataBac[0]}`}
          value={formtaNumber(dataBac[1].candidati, 0)}
          Icon={FaUserGraduate}
        />
        {dataAdm && (
          <SnippetCard
            title={`Medie Evaluare ${dataAdm[0]}`}
            value={formtaNumber(dataAdm[1].medieEn, 2)}
            Icon={FaPersonCircleCheck}
          />
        )}

        <Card className="row-span-4 flex flex-col justify-center sm:col-span-2 lg:max-xl:col-span-4">
          <div className="hidden lg:block">
            <MainChart rezultateBac={rezultateBac} aspectRatio={1.87} />
          </div>
          <div className="lg:hidden">
            <MainChart rezultateBac={rezultateBac} aspectRatio={1} />
          </div>
        </Card>
      </div>

      <div className="grid w-full gap-4 self-center lg:grid-cols-2">
        <ChartCard
          title={`Distribuție limbi străine ${dataBac[0]}`}
          Icon={IoLanguage}
        >
          <PieChart
            data={Object.entries(dataBac[1].limbiStraine).map(([limba, e]) => ({
              name: limba,
              value: e.candidati,
            }))}
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
          />
        </ChartCard>
      </div>
    </MainContainer>
  );
}

function getInfoJudet(id: string) {
  const idJudet = judetDupaNume(id).id;
  const numeJudet = judetDupaNume(id).numeIntreg;

  const rezultateBac = {} as {
    [an: number]: {
      medie?: number;
      candidati: number;
      candidatiValizi: number;
      rataPromovare?: number;
      medieEn?: number;
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
    };
  };

  query.bacJudete
    .filter((result) => result.id_judet == idJudet)
    .forEach((result) => {
      rezultateBac[result.an] = {
        medie: result._avg.my_medie || undefined,
        candidati: result._count._all,
        candidatiValizi: result._count.my_medie,
        limbiMaterne: {},
        limbiStraine: {},
      };
    });

  query.promovatiBacJudete
    .filter((result) => result.id_judet == idJudet)
    .forEach((result) => {
      const d = rezultateBac[result.an];

      if (d) {
        d.rataPromovare = (result._count._all / d.candidatiValizi) * 100;
      }
    });

  query.limbiMaterneBacJudete
    .filter((result) => result.id_judet == idJudet)
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

  query.limbiStraineBacJudete
    .filter((result) => result.id_judet == idJudet)
    .forEach((e) => {
      const d = rezultateBac[e.an];

      if (d) {
        d.limbiStraine[e.limba_moderna] = {
          candidati: e._count._all,
        };
      }
    });

  query.enJudete
    .filter((result) => result.id_judet == idJudet)
    .forEach((result) => {
      const d = rezultateBac[result.an];

      if (d) {
        d.medieEn = result._avg.medie_en || undefined;
      }
    });

  return {
    numeJudet,
    rezultateBac,
  };
}

function MainChart({
  rezultateBac: data,
  aspectRatio,
}: {
  rezultateBac: {
    [an: string]: {
      medie?: number;
      candidati: number;
      rataPromovare?: number;
      medieEn?: number;
    };
  };
  aspectRatio: number;
}) {
  const entries = Object.entries(data).sort();

  const chartData = {
    labels: entries.map((e) => e[0]),
    datasets: [
      {
        label: "Medie Bac",
        data: entries.map((e) => e[1].medie),
        fill: false,
        backgroundColor: "#FD8A8A",
        borderColor: "#FD8A8A",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Medie Evaluare",
        data: entries.map((e) => e[1].medieEn),
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

  return (
    <div
      style={{
        aspectRatio: aspectRatio,
      }}
    >
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
}
