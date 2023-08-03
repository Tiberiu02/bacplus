import { Chart } from "~/components/client-ports/Chart";

const magicNumbers = [0];
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 2 ** i; j++) {
    magicNumbers.push((magicNumbers[j] ?? 0) + 0.5 ** (i + 1));
  }
}

const colors: {
  [key: string]: string;
} = {};

function colorFromStr(str: string) {
  if (colors[str] == undefined) {
    const hue = (magicNumbers[Object.keys(colors).length] ?? 0) * 360;
    colors[str] = `hsl(${hue}, 100%, 75%)`;
  }

  return colors[str];
}

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

  data.sort((a, b) => b.value - a.value);

  return (
    <Chart
      type="pie"
      data={{
        labels: data.map(
          (e) =>
            `${e.name} (${
              convertToPercentages
                ? Math.round((e.value / total) * 100) + "%"
                : e.value
            })`
        ),
        datasets: [
          {
            data: data.map((e) =>
              convertToPercentages
                ? Math.round((e.value / total) * 100)
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
