import type { MouseEventHandler, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export const buttonClassName =
  "py-2 rounded border-[1px] border-gray-300 px-3 text-black transition-all duration-200 hover:border-blue-700 hover:bg-gray-50";

export function Button({
  children,
  className,
  ariaLabel,
  onClick,
  btnRef,
}: PropsWithChildren<{
  className?: string;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  btnRef?: React.Ref<HTMLButtonElement>;
}>) {
  return (
    <button
      className={twMerge(buttonClassName, className)}
      aria-label={ariaLabel}
      onClick={onClick}
      ref={btnRef}
    >
      {children}
    </button>
  );
}
