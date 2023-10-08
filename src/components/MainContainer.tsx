import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function MainContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={twMerge(
        "mx-auto flex w-full max-w-6xl flex-col gap-4 overflow-x-hidden px-3",
        className
      )}
    >
      {children}
    </div>
  );
}
