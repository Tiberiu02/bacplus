import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function Title({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className="mb-8 mt-16">
      <h1
        className={twMerge(
          "mb-8 text-center text-2xl font-semibold [text-wrap:balance] sm:text-3xl lg:text-4xl",
          className
        )}
      >
        {children}
      </h1>
    </div>
  );
}
