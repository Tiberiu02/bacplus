"use client";

import { useState } from "react";

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
  const [hovered, setHovered] = useState<string | null>(null);

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
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg viewBox="-5 -5 110 110" className="w-full max-w-[16rem]">
          {/* SVG Pie slices */}
          {entries.map((e) => (
            <path
              key={e.name}
              d={`
                M 50 50
                L ${50 - 50 * Math.sin(e.startAngle)} ${
                50 - 50 * Math.cos(e.startAngle)
              }
                A 50 50 0 ${e.endAngle - e.startAngle > Math.PI ? 1 : 0} 0 ${
                50 - 50 * Math.sin(e.endAngle)
              } ${50 - 50 * Math.cos(e.endAngle)}
                Z
              `}
              fill={e.color}
              className="stroke-white transition-all duration-300 ease-in-out hover:scale-[1.02] hover:stroke-gray-100 hover:brightness-90 hover:saturate-[1.5]"
              onPointerEnter={() => setHovered(e.name)}
              onPointerLeave={() => setHovered(null)}
              style={{
                transformOrigin: "50% 50%",
              }}
            />
          ))}
        </svg>

        {/* Labels visible on slice hover */}
        {entries.map((e) => (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white transition-all duration-300 ease-in-out"
            key={e.name}
            style={{
              left: `${50 - 33 * Math.sin(e.midAngle)}%`,
              top: `${50 - 33 * Math.cos(e.midAngle)}%`,
              opacity: hovered === e.name ? 1 : 0,
            }}
          >
            {e.label}
          </div>
        ))}
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
        {entries.map((e) => (
          <div className="flex items-center gap-2" key={e.name}>
            <div
              className="flex h-4 w-4 items-center justify-center overflow-hidden border-4"
              style={{
                borderColor: e.color,
                outlineColor: e.color,
              }}
            >
              <div
                className="h-4 w-4 brightness-110"
                style={{
                  backgroundColor: e.color,
                }}
              />
            </div>
            <div>{e.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
