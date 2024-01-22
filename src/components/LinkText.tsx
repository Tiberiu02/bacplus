import Link from "next/link";
import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function LinkText({
  children,
  href,
  className,
  target,
  scroll,
}: PropsWithChildren<{
  href?: string;
  className?: string;
  target?: string;
  scroll?: boolean;
}>) {
  return (
    <Link
      className={twMerge(
        "font-semibold text-blue-700 hover:text-blue-800 hover:underline",
        className
      )}
      href={href ? href : "/"}
      target={target}
      scroll={scroll}
    >
      {children}
    </Link>
  );
}
