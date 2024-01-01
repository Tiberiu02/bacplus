import { FaAward } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { LuMessagesSquare as TbMessageLanguage } from "react-icons/lu";
import {
  FaPersonCircleCheck,
  FaSchoolCircleCheck,
  FaUserGraduate,
} from "react-icons/fa6";
import { Chart } from "~/components/client-ports/Chart";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import { query } from "~/data/dbQuery";
import { formtaNumber } from "~/data/formatNumber";
import type { Metadata } from "next";
import { PieChart } from "~/components/PieChart";
import { Card, ChartCard, SnippetCard } from "~/components/Cards";
import { notFound } from "next/navigation";
import { judetDupaCod } from "~/data/coduriJudete";
import type { Judet } from "~/data/data";
import { TopJudete } from "~/components/TopJudete";

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const numeLiceu = query.licee.find(
    (e) => e.id_liceu == params.id
  )?.nume_liceu;

  if (!numeLiceu) return {};

  return {
    title: `Statistici Naționale | Bac Plus`,
    description: `Vezi informații despre starea educației în România la nivel național, bazate pe rezultatele oficiale de la examenele de Bacalaureat și Evaluare Națională publicate de Ministerul Educației Naționale.`,
  };
}

export default function PaginaNational() {
  const { rezultateBac } = getInfoNational();

  const dataBac = Object.entries(rezultateBac).at(-1);
  const dataAdm = Object.entries(rezultateBac)
    .filter((e) => e[1].medieEn)
    .at(-1);

  if (!dataBac) notFound();

  const judete = getJudete();

  return (
    <MainContainer>
      <Title>Statistici la nivel național</Title>
      <p>
        Pe această pagină puteți vedea informații despre starea educației în
        România la nivel național, bazate pe rezultatele oficiale la examenele
        de Bacalaureat și Evaluare Națională publicate de Ministerul Educației
        Naționale.
      </p>

      <div className="mt-8 grid w-full grid-cols-1 gap-4 self-center sm:grid-cols-2 sm:grid-rows-[audo_auto_auto] xl:grid-cols-4 xl:grid-rows-[auto_auto] 2xl:grid-flow-col 2xl:grid-cols-[auto_1fr] 2xl:grid-rows-4">
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
          value={formtaNumber(dataBac[1].candidati, 2)}
          Icon={FaUserGraduate}
        />
        {dataAdm && (
          <SnippetCard
            title={`Medie Evaluare ${dataAdm[0]}`}
            value={formtaNumber(dataAdm[1].medieEn, 2)}
            Icon={FaPersonCircleCheck}
          />
        )}

        <Card className="row-span-4 flex flex-col justify-center sm:col-span-2 xl:max-2xl:col-span-4">
          <div className="hidden xl:block">
            <MainChart rezultateBac={rezultateBac} aspectRatio={1.87} />
          </div>
          <div className="xl:hidden">
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

      <Title>Clasamentul județelor</Title>
      <div className="mb-8 flex flex-col gap-2">
        <p>
          Acest clasament a fost realizat folosind rezultatele oficiale la
          Bacalaureat și Evaluare.
        </p>
        <p>
          Apăsați pe un anumit județ pentru a vedea mai multe statistici despre
          acesta.
        </p>
      </div>

      <TopJudete data={judete} />
    </MainContainer>
  );
}

function getJudete() {
  const judete = {} as {
    [an: number]: {
      [id: string]: Judet;
    };
  };

  query.bacJudete.forEach((result) => {
    if (result.id_judet === null) return;

    const d = judete[result.an] ?? {};
    judete[result.an] = d;

    d[result.id_judet] = {
      id: result.id_judet,
      nume: judetDupaCod(result.id_judet).nume,
      numeIntreg: judetDupaCod(result.id_judet).numeIntreg,
      medieBac: result._avg.my_medie ?? undefined,
      numCandidatiBac: result._count._all,
      numCandidatiValiziBac: result._count.my_medie,
      rataPromovareBac: 0,
      medieEn: undefined,
      numCandidatiEn: undefined,
    };
  });

  query.promovatiBac.forEach((result) => {
    if (result.id_judet === null) return;

    const d = judete[result.an];
    if (!d) return;

    const obj = d[result.id_judet];
    if (obj != undefined) {
      obj.rataPromovareBac +=
        (result._count._all / obj.numCandidatiValiziBac) * 100;
    }
  });

  query.enJudete.forEach((result) => {
    if (result.id_judet === null) return;

    const d = judete[result.an];
    if (!d) return;

    const obj = d[result.id_judet];
    if (obj != undefined) {
      obj.medieEn = result._avg.medie_en ?? undefined;
      obj.numCandidatiEn = result._count._all;
    }
  });

  return Object.fromEntries(
    Object.entries(judete).map(([an, judete]) => [
      Number(an),
      Object.values(judete),
    ])
  );
}

function getInfoNational() {
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

  query.bacNational.forEach((result) => {
    rezultateBac[result.an] = {
      medie: result._avg.my_medie || undefined,
      candidati: result._count._all,
      candidatiValizi: result._count.my_medie,
      limbiMaterne: {},
      limbiStraine: {},
    };
  });

  query.promovatiBacNational.forEach((result) => {
    const d = rezultateBac[result.an];

    if (d) {
      d.rataPromovare = (result._count._all / d.candidatiValizi) * 100;
    }
  });

  query.limbiMaterneBacNational.forEach((e) => {
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

  query.limbiStraineBacNational.forEach((e) => {
    const d = rezultateBac[e.an];

    if (d) {
      d.limbiStraine[e.limba_moderna] = {
        candidati: e._count._all,
      };
    }
  });

  query.enNational.forEach((result) => {
    const d = rezultateBac[result.an];

    if (d) {
      d.medieEn = result._avg.medie_en || undefined;
    }
  });

  return {
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
