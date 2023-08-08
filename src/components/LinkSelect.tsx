"use client";

import ReactSelect from "react-select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

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
  const router = useRouter();

  const optionsWithLink = options.map((o) => ({
    label: (
      <Link scroll={false} href={o.link}>
        {o.label}
      </Link>
    ),
    value: o.value.toString(),
    link: o.link,
  }));

  return (
    <ReactSelect
      aria-label={ariaLabel}
      className={className}
      classNames={{
        control: () => twMerge("!rounded !border-gray-300"),
      }}
      options={optionsWithLink}
      defaultValue={optionsWithLink.find((o) => o.value == defaultValue)}
      isSearchable={false}
      onChange={(option) =>
        option && router.replace(option.link, { scroll: false })
      }
    />
  );
}
