"use client";
import type { HTMLInputTypeAttribute } from "react";
import type { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export function TextInput({
  placeHolder,
  onChange,
  Icon,
  type,
  value,
  className,
}: {
  placeHolder: string;
  onChange: (value: string) => void;
  Icon?: IconType;
  type?: HTMLInputTypeAttribute;
  value?: string;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex h-10 items-center gap-4 rounded-full border-[1px] border-gray-300 px-3 text-black transition-all duration-200 focus-within:border-blue-700 hover:border-blue-700",
        className
      )}
    >
      {Icon && <Icon className="shrink-0 text-gray-400" />}
      <input
        className="w-full bg-transparent outline-none"
        placeholder={placeHolder}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        value={value}
      />
    </div>
  );
}
