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
  convertToPercentages = false,
}: {
  data: { name: string; value: number; color?: string }[];
  convertToPercentages?: boolean;
}) {
  const total = data.reduce((acc, e) => acc + e.value, 0);
  let sumSoFar = 0;

  data.sort((a, b) => b.value - a.value);

  const entries = data.map((e) => ({
    name: e.name,
    label: `${e.name} (${
      convertToPercentages ? `${Math.round((e.value / total) * 100)}%` : e.value
    })`,
    color: e.color ?? colorFromStr(e.name),
    startAngle: (sumSoFar / total) * Math.PI * 2,
    endAngle: ((sumSoFar + e.value) / total) * Math.PI * 2 - 0.001,
    midAngle: ((sumSoFar + e.value / 2) / total) * Math.PI * 2,
    sumSoFar: (sumSoFar += e.value),
    value: e.value,
  }));

  return (
    <div className="max-w flex flex-row gap-6">
      <div className="group relative shrink-0">
        <svg viewBox="-5 -5 110 110" className="w-full max-w-[4rem]">
          {/* SVG Pie slices */}
          {entries.map((e) => (
            <path
              key={e.name}
              d={`
                M 50 50
                L ${50 + 50 * Math.sin(e.startAngle)} ${
                50 - 50 * Math.cos(e.startAngle)
              }
                A 50 50 0 ${e.endAngle - e.startAngle > Math.PI ? 1 : 0} 1 ${
                50 + 50 * Math.sin(e.endAngle)
              } ${50 - 50 * Math.cos(e.endAngle)}
                Z
              `}
              fill={e.color}
              className="stroke-white"
              style={{
                transformOrigin: "50% 50%",
              }}
            />
          ))}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="my-auto flex flex-col gap-x-8 gap-y-2 text-sm">
        {entries.map((e) => (
          <div className="flex items-center gap-2" key={e.name}>
            <div
              className="flex h-2 w-2 shrink-0 items-center justify-center overflow-hidden rounded-full [text-wrap:balance]"
              style={{
                backgroundColor: e.color,
              }}
            ></div>
            <div className="[text-wrap:balance]">{e.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
