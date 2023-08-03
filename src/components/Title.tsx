import type { PropsWithChildren } from "react";

export function Title({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div>
      <h1
        className={
          "mt-12 text-2xl font-semibold sm:text-3xl lg:text-4xl " +
          (className ? className : "")
        }
      >
        {children}
      </h1>
      <hr className="my-2" />
    </div>
  );
}
