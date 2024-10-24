"use client";
import { BeatLoader } from "react-spinners";

export function LoadingSpinner({
  color = "#bbb",
  size = 10,
  className,
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <BeatLoader
      color={color}
      loading={true}
      size={size}
      aria-label="Se încarcă..."
      data-testid="loader"
      className={className}
    />
  );
}
