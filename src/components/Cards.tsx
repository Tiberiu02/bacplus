import type { PropsWithChildren } from "react";
import type { IconType } from "react-icons/lib";
import { twMerge } from "tailwind-merge";

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={twMerge("rounded bg-gray-100 p-4 py-3 shadow", className)}>
      {children}
    </div>
  );
}

export function SnippetCard({
  title,
  value,
  Icon,
}: {
  title: string;
  value: string;
  Icon: IconType;
}) {
  return (
    <Card className="flex items-center gap-3">
      <Icon className="shrink-0 text-5xl text-blue-500 opacity-60" />
      <div className="mx-auto flex flex-col items-center gap-1 p-1">
        <div className="whitespace-nowrap text-xs font-bold opacity-50">
          {title}
        </div>
        <div className="text-4xl font-bold">{value}</div>
      </div>
    </Card>
  );
}

export function ChartCard({
  title,
  Icon,
  children,
}: PropsWithChildren<{
  title: string;
  Icon: IconType;
}>) {
  return (
    <Card className="flex w-full max-w-[calc(100vw-1.5rem)] flex-col gap-5">
      <div className="flex max-w-full items-center gap-3 text-xl font-semibold">
        <Icon className="shrink-0 text-3xl text-blue-500 opacity-60" />
        <div className="opacity-90">{title}</div>
      </div>
      {children}
    </Card>
  );
}
