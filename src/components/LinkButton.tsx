import Link from "next/link";
import type { PropsWithChildren } from "react";

export default function LinkButton({
  children,
  href,
  className,
}: PropsWithChildren<{ href?: string; className?: string }>) {
  return (
    <Link
      className={
        "rounded-md border-2 border-blue-500/80 bg-blue-100/40 bg-opacity-10 px-4 py-2 text-xl font-semibold text-blue-500 transition duration-200 hover:bg-blue-500 hover:text-white " +
        (className ? className : "")
      }
      href={href ? href : "/"}
    >
      {children}
    </Link>
  );
}
