import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function LinkText({
  children,
  href,
  className,
}: PropsWithChildren<{ href?: string; className?: string }>) {
  return (
    <a
      className={twMerge(
        "text-blue-400 hover:text-blue-600 hover:underline",
        className
      )}
      href={href ? href : "/"}
    >
      {children}
    </a>
  );
}
