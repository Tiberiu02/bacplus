import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={twMerge(
        "rounded-lg border-[1px] border-gray-200 p-6 py-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SnippetCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="mx-auto flex flex-col items-center gap-1">
      <div className="whitespace-nowrap text-xs font-bold text-gray-600">
        {title}
      </div>
      <div className="text-4xl font-bold">{value}</div>
    </div>
  );
}

export function ChartCard({
  title,
  children,
}: PropsWithChildren<{
  title: string;
}>) {
  return (
    <div className="flex w-full max-w-[calc(100vw-1.5rem)] flex-col items-center gap-6 overflow-clip">
      <div className="text-center text-xl font-semibold">{title}</div>
      {children}
    </div>
  );
}
