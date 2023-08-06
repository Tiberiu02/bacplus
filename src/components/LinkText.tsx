import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function LinkText({
  children,
  href,
  className,
  target,
}: PropsWithChildren<{ href?: string; className?: string; target?: string }>) {
  return (
    <a
      className={twMerge(
        "font-semibold text-blue-700 hover:text-blue-800 hover:underline",
        className
      )}
      href={href ? href : "/"}
      target={target}
    >
      {children}
    </a>
  );
}
