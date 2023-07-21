import { formtaNumber } from "~/app/utils/formatNumber";

type RGB = [number, number, number];

function h2r(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1]!, 16)!,
    parseInt(result[2]!, 16)!,
    parseInt(result[3]!, 16)!,
  ];
}

// Inverse of the above
function r2h(rgb: RGB) {
  return (
    "#" +
    ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
  );
}

// Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
// Taken from the awesome ROT.js roguelike dev library at
// https://github.com/ondras/rot.js
function _interpolateColor(color1: RGB, color2: RGB, factor = 0.5) {
  let result = color1.slice();
  for (var i = 0; i < 3; i++) {
    result[i] = Math.round(result[i]! + factor * (color2[i]! - color1[i]!));
  }
  return result;
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

function _interpolateHSL(color1: RGB, color2: RGB, factor: number = 0.5) {
  const hsl1 = rgb2hsl(color1);
  const hsl2 = rgb2hsl(color2);
  for (let i = 0; i < 3; i++) {
    hsl1[i] += factor * (hsl2[i]! - hsl1[i]!);
  }
  return hsl2rgb(hsl1);
}

export function PercentageBar({ value }: { value: number }) {
  const color1 = h2r("#ff3333")!;
  const color2 = h2r("#88ee88")!;

  const color = _interpolateHSL(color1, color2, value / 100);

  return (
    <div
      className={
        "relative h-6 overflow-hidden rounded-full bg-gray-100 outline outline-2 outline-gray-300"
      }
    >
      <div
        className="absolute left-0 top-0 h-6 rounded-r-full"
        style={{
          width: `calc((100% - 0.75rem) * ${value / 100} + 0.75rem)`,
          backgroundColor: r2h(color),
        }}
      />
      <div className="relative">{formtaNumber(value, 1)}%</div>
    </div>
  );
}
