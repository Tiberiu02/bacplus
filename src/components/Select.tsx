"use client";

import { twMerge } from "tailwind-merge";
import { PiCaretDownBold } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";

export function Select<T extends string | number>({
  options,
  className,
  ariaLabel,
  value,
  onChange,
}: {
  options: {
    value: T;
    label: string;
  }[];
  className?: string;
  ariaLabel?: string;
  value: T;
  onChange: (value: T) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [popupMaxWidth, setPopupMaxWidth] = useState(
    undefined as string | undefined
  );

  const inputRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((o) => o.value == value);

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
    throw new Error(`Could not find option with value '${value}' in options`);
  }

  return (
    <button
      className={twMerge(
        "relative flex min-h-[2rem] flex-shrink grow-0 items-center rounded-md pl-3 pr-4 text-left text-base [text-wrap:balance] hover:bg-blue-50",
        className
      )}
      onClick={() => {
        setIsDropdownOpen(!isDropdownOpen);
        const input = inputRef.current;
        if (input) {
          const rect = input.getBoundingClientRect();
          const x = rect.left;
          const maxW = window.innerWidth - x - 10;
          setPopupMaxWidth(`${maxW}px`);
        }
      }}
      aria-label={ariaLabel}
      ref={inputRef}
    >
      <div
        className={twMerge("mr-2 text-sm", isDropdownOpen && "-scale-y-100")}
      >
        <PiCaretDownBold />
      </div>
      <div className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap">
        {selectedOption.label}
      </div>
      <div
        className={twMerge(
          "absolute left-0 top-full z-50 mt-1 flex max-h-64 min-w-full flex-col overflow-y-auto overflow-x-hidden whitespace-nowrap rounded border-[1px] border-gray-300 bg-white py-1 text-left shadow sm:max-h-96",
          !isDropdownOpen && "hidden"
        )}
        style={{
          maxWidth: popupMaxWidth,
        }}
      >
        {options.map((o, ix) => (
          <span
            className="shrink-0 overflow-hidden text-ellipsis px-3 py-1 hover:bg-gray-150"
            onClick={() => onChange(o.value)}
            key={ix}
          >
            {o.label}
          </span>
        ))}
      </div>
    </button>
  );
}
