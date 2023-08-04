import { FaAward } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { FaPenNib, FaUserGraduate } from "react-icons/fa6";
import { TbMathFunction } from "react-icons/tb";
import { Chart } from "~/components/client-ports/Chart";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import { query } from "~/data/dbQuery";
import { formtaNumber } from "~/data/formatNumber";
import { ShareButtons } from "~/components/ShareButtons";
import { judetDupaCod } from "~/data/coduriJudete";
import type { Metadata } from "next";
import { PieChart } from "~/components/PieChart";
import { Card, ChartCard, SnippetCard } from "~/components/Cards";
import { env } from "~/env.mjs";
import { notFound } from "next/navigation";
import { Announcements } from "~/components/Announcements";

export function generateStaticParams() {
  return query.scoli.map((e) => ({
    id: e.id_scoala,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const numeScoala = query.scoli.find(
    (e) => e.id_scoala == params.id
  )?.nume_scoala;

  if (!numeScoala) return {};

  const title = `${numeScoala} | Bac Plus`;
  const description = `Vezi informații detaliate despre ${numeScoala}, bazate pe rezultatele oficiale de la examenul de Evaluare Națională publicate de Ministerul Educației Naționale.`;

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

export default function PaginaScoala({
  params: { id },
}: {
  params: { id: string };
}) {
  const { numeScoala, codJudet, rezultateEn } = getInfoScoala(id);

  const data = Object.entries(rezultateEn).at(-1);

  if (!data || !codJudet) notFound();

  return (
    <MainContainer>
      <Title>{numeScoala}</Title>

      <Announcements />

      <p>
        Pe această pagină puteți vedea informații despre <b>{numeScoala}</b> din{" "}
        {judetDupaCod(codJudet).numeIntreg}, bazate pe rezultatele la examenul
        de Evaluare Națională publicate de Ministerul Educației Naționale.
      </p>
      <div className="my-4 flex justify-end">
        <ShareButtons />
      </div>

      <div className="flex w-full flex-col items-center gap-4 xl:flex-row">
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:w-fit xl:flex-col">
          <SnippetCard
            title={`Medie Evaluare ${data[0]}`}
            value={formtaNumber(data[1].medieEvaluareNationala, 3)}
            Icon={FaAward}
          />
          <SnippetCard
            title={`Medie română ${data[0]}`}
            value={formtaNumber(data[1].medieLimbaRomana, 3)}
            Icon={FaPenNib}
          />
          <SnippetCard
            title={`Medie matematică ${data[0]}`}
            value={formtaNumber(data[1].medieMatematica, 3)}
            Icon={TbMathFunction}
          />
          <SnippetCard
            title={`Absolvenți ${data[0]}`}
            value={data[1].candidati.toString()}
            Icon={FaUserGraduate}
          />
        </div>

        <Card className="relative flex w-full flex-col justify-center self-stretch">
          <div className="hidden lg:block">
            <MainChart rezultateEn={rezultateEn} aspectRatio={1.87} />
          </div>
          <div className="lg:hidden">
            <MainChart rezultateEn={rezultateEn} aspectRatio={1} />
          </div>
        </Card>
      </div>

      <div className="mt-1 grid w-full gap-4 self-center overflow-hidden lg:grid-cols-2">
        <ChartCard
          title={`Distribuție limbi materne ${data[0]}`}
          Icon={IoLanguage}
        >
          <PieChart
            data={Object.entries(data[1].limbiMaterne).map(([limba, e]) => ({
              name: limba,
              value: e.candidati,
            }))}
            aspectRatio={1.7}
          />
        </ChartCard>
      </div>
    </MainContainer>
  );
}

function getInfoScoala(id: string) {
  const codJudet = query.en.find((result) => result.id_scoala == id)?.id_judet;
  const { nume_scoala: numeScoala } =
    query.scoli.find((result) => result.id_scoala == id) || {};

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
    if (result.id_scoala != id) return;

    rezultateEn[result.an] = {
      medieEvaluareNationala: result._avg.medie_en ?? undefined,
      medieLimbaRomana: result._avg.lr_final ?? undefined,
      medieMatematica: result._avg.ma_final ?? undefined,
      medieLimbaMaterna: result._avg.lm_final ?? undefined,
      medieAbsolvire: result._avg.medie_abs ?? undefined,
      candidati: result._count._all,
      limbiMaterne: {},
    };
  });

  query.limbiMaterneEn.forEach((result) => {
    if (result.id_scoala != id) return;

    const obj = rezultateEn[result.an];
    if (obj != undefined) {
      obj.limbiMaterne[result.limba_materna || "Limba română"] = {
        candidati: result._count._all,
      };
    }
  });

  return {
    rezultateEn,
    codJudet,
    numeScoala,
  };
}

function MainChart({
  rezultateEn: data,
  aspectRatio,
}: {
  rezultateEn: {
    [an: string]: {
      candidati: number;
      medieEvaluareNationala?: number;
      medieLimbaRomana?: number;
      medieMatematica?: number;
      medieLimbaMaterna?: number;
      medieAbsolvire?: number;
    };
  };
  aspectRatio: number;
}) {
  const entries = Object.entries(data).sort();

  const chartData = {
    labels: entries.map((e) => e[0]),
    datasets: [
      {
        label: "Medie Evaluare Națională",
        data: entries.map((e) => e[1].medieEvaluareNationala),
        fill: false,
        backgroundColor: "#FD8A8A",
        borderColor: "#FD8A8A",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Medie limba română",
        data: entries.map((e) => e[1].medieLimbaRomana),
        fill: false,
        backgroundColor: "#FDAD35",
        borderColor: "#FDAD35",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Medie absolvire",
        data: entries.map((e) => e[1].medieAbsolvire),
        fill: false,
        backgroundColor: "#FF5575",
        borderColor: "#FF5575",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Medie matematică",
        data: entries.map((e) => e[1].medieMatematica),
        fill: false,
        backgroundColor: "#FD46AD",
        borderColor: "#FD46AD",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Medie limba maternă",
        data: entries.map((e) => e[1].medieLimbaMaterna),
        fill: false,
        backgroundColor: "#ff8552",
        borderColor: "#ff8552",
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
