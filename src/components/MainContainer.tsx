import { PropsWithChildren } from "react";

export function MainContainer({ children }: PropsWithChildren<{}>) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3">
      {children}
    </div>
  );
}
