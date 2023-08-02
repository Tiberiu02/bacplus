import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function MainContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={twMerge(
        "mx-auto flex w-full max-w-[calc(min(72rem,100vw))] flex-col gap-4 px-3",
        className
      )}
    >
      {children}
    </div>
  );
}
