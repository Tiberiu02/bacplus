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
        "text-blue-400 hover:text-blue-600 hover:underline",
        className
      )}
      href={href ? href : "/"}
      target={target}
    >
      {children}
    </a>
  );
}
