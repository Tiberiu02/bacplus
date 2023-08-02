import stringHash from "string-hash";
import { Chart } from "~/components/client-ports/Chart";

const colorFromStr = (str: string) =>
  `hsl(${stringHash(str) % 360}, 100%, 75%)`;

export function PieChart({
  data,
  aspectRatio,
  convertToPercentages = false,
}: {
  data: { name: string; value: number; color?: string }[];
  aspectRatio: number;
  convertToPercentages?: boolean;
}) {
  const total = data.reduce((acc, e) => acc + e.value, 0);

  return (
    <Chart
      type="pie"
      data={{
        labels: data.map((e) => e.name),
        datasets: [
          {
            data: data.map((e) =>
              convertToPercentages
                ? Math.round((e.value / total) * 1000) / 10
                : e.value
            ),
            backgroundColor: data.map((e) => e.color ?? colorFromStr(e.name)),
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      }}
    />
  );
}
