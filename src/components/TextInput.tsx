"use client";
import { HTMLInputTypeAttribute } from "react";
import { IconType } from "react-icons";

export function TextInput({
  placeHolder,
  onChange,
  Icon,
  type,
  value,
}: {
  placeHolder: string;
  onChange: (value: string) => void;
  Icon?: IconType;
  type?: HTMLInputTypeAttribute;
  value?: string;
}) {
  return (
    <div className="flex h-10 items-center gap-4 rounded-full border-[1px] border-gray-300 px-3 text-black transition-all duration-200 focus-within:border-blue-700 hover:border-blue-700">
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
