import { twMerge } from "tailwind-merge";
import { formtaNumber } from "~/data/formatNumber";

type RGB = [number, number, number];

function h2r(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) return [0, 0, 0];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

// Inverse of the above
function r2h(rgb: RGB) {
  return (
    "#" +
    ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
  );
}

function rgb2hsl(color: RGB): RGB {
  const r = color[0] / 255;
  const g = color[1] / 255;
  const b = color[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max == r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max == g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return [h, s, l];
}

function hsl2rgb(color: RGB): RGB {
  let l = color[2];

  if (color[1] == 0) {
    l = Math.round(l * 255);
    return [l, l, l];
  } else {
    function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    const s = color[1];
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, color[0] + 1 / 3);
    const g = hue2rgb(p, q, color[0]);
    const b = hue2rgb(p, q, color[0] - 1 / 3);
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
}

function _interpolateHSL(color1: RGB, color2: RGB, factor = 0.5) {
  const hsl1 = rgb2hsl(color1);
  const hsl2 = rgb2hsl(color2);
  hsl1[0] += factor * (hsl2[0] - hsl1[0]);
  hsl1[1] += factor * (hsl2[1] - hsl1[1]);
  hsl1[2] += factor * (hsl2[2] - hsl1[2]);
  return hsl2rgb(hsl1);
}

function dimColor(color: RGB, factor: number): RGB {
  return [
    Math.round(color[0] * factor),
    Math.round(color[1] * factor),
    Math.round(color[2] * factor),
  ];
}

const CircularProgress = ({
  radius,
  thickness,
  percentage,
  className,
}: {
  radius: number;
  thickness: number;
  percentage: number;
  className?: string;
}) => {
  const normalizedRadius = radius - thickness / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const greenLength = (percentage / 100) * circumference;
  const redLength = circumference - greenLength;

  return (
    <svg className={className} viewBox="0 0 100 100">
      <circle
        stroke="#FFB0B0" // red
        fill="transparent"
        strokeWidth={thickness}
        strokeDasharray={`0 ${greenLength - 10} ${redLength + 10}`}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#90EC8E" // green
        fill="transparent"
        strokeWidth={thickness}
        strokeDasharray={`${greenLength} ${redLength}`}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

export function PercentageBar({
  value,
  className,
}: {
  value?: number;
  className?: string;
}) {
  if (value == undefined) return null;

  const color1 = h2r("#ff3333");
  const color2 = h2r("#88ee88");

  const color = _interpolateHSL(color1, color2, value / 100);

  const borderColor = dimColor(color, 0.8);

  return (
    <div
      className={twMerge("mx-auto flex w-20 items-center gap-2", className)}
      style={{
        outlineColor: r2h(borderColor),
      }}
    >
      <CircularProgress
        radius={50}
        thickness={30}
        percentage={value}
        className="h-4 w-4 shrink-0"
      />
      <div>{formtaNumber(value, 1, 0)}%</div>
    </div>
  );
}
