"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { PiCaretDownBold } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

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
  }, [isDropdownOpen, inputRef.current]);

  if (!selectedOption) {
    throw new Error(
      `Could not find option with value ${defaultValue} in options`
    );
  }

  return (
    <Button
      className={twMerge(
        "relative flex h-9 items-center justify-between rounded border-[1px] border-gray-300 px-3 text-base transition-all duration-200 hover:border-blue-700 hover:bg-gray-50",
        className
      )}
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      aria-label={ariaLabel}
      btnRef={inputRef}
    >
      {selectedOption.label}
      <div
        className={twMerge(
          "ml-2 border-l-[1px] border-gray-200 pl-2 text-gray-500",
          isDropdownOpen && "-scale-y-100"
        )}
      >
        <PiCaretDownBold />
      </div>
      <div
        className={twMerge(
          "absolute left-0 top-full z-50 mt-1 flex max-h-64 w-full flex-col overflow-auto rounded border-[1px] border-gray-300 bg-white py-1 text-left shadow sm:max-h-96",
          !isDropdownOpen && "hidden"
        )}
      >
        {options.map((o) => (
          <Link
            className="px-3 py-1 hover:bg-gray-150"
            href={o.link}
            scroll={false}
            onClick={() => setSelectedValue(o.value)}
            key={o.value}
          >
            {o.label}
          </Link>
        ))}
      </div>
    </Button>
    // <ReactSelect
    //   aria-label={ariaLabel}
    //   className={className}
    //   classNames={{
    //     control: () => twMerge("!rounded !border-gray-300"),
    //   }}
    //   options={optionsWithLink}
    //   defaultValue={optionsWithLink.find((o) => o.value == defaultValue)}
    //   isSearchable={false}
    //   onChange={(option) =>
    //     option && router.replace(option.link, { scroll: false })
    //   }
    // />
  );
}
