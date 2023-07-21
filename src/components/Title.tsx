import { PropsWithChildren } from "react";

export function Title({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div>
      <h1
        className={
          "mb-4 mt-12 text-4xl font-semibold " + (className ? className : "")
        }
      >
        {children}
      </h1>
      <hr className="my-4" />
    </div>
  );
}
