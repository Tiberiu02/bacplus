"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { PiCaretDownBold } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";

export function LinkSelect({
  options,
  defaultValue,
  className,
  ariaLabel,
}: {
  options: {
    value: string | number;
    label: string;
    link: string;
  }[];
  defaultValue: string | number;
  className?: string;
  ariaLabel?: string;
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((o) => o.value == selectedValue);

  useEffect(() => {
    const input = inputRef.current;

    if (isDropdownOpen && input) {
      const listener = (evt: MouseEvent) => {
        const eventPath = evt.composedPath();
        const clickedInside = eventPath.includes(input);
        if (!clickedInside) setIsDropdownOpen(false);
      };
      window.addEventListener("click", listener);
      return () => window.removeEventListener("click", listener);
    }
  }, [isDropdownOpen, inputRef]);

  if (!selectedOption) {
    throw new Error(
      `Could not find option with value ${defaultValue} in options`
    );
  }

  return (
    <button
      className={twMerge(
        "relative flex h-8 items-center rounded pl-3 pr-4 text-base hover:bg-blue-50",
        className
      )}
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      aria-label={ariaLabel}
      ref={inputRef}
    >
      <div
        className={twMerge("mr-2 text-sm", isDropdownOpen && "-scale-y-100")}
      >
        <PiCaretDownBold />
      </div>
      {selectedOption.label}
      <div
        className={twMerge(
          "absolute left-0 top-full z-50 mt-1 flex max-h-64 w-fit min-w-full flex-col overflow-auto whitespace-nowrap rounded border-[1px] border-gray-300 bg-white py-1 text-left shadow sm:max-h-96",
          !isDropdownOpen && "hidden"
        )}
      >
        {options.map((o) => (
          <Link
            className="px-3 py-1 pl-4 hover:bg-gray-150"
            href={o.link}
            scroll={false}
            onClick={() => setSelectedValue(o.value)}
            key={o.value}
            replace={true}
          >
            {o.label}
          </Link>
        ))}
      </div>
    </button>
  );
}
