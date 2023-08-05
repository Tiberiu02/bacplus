"use client";

import ReactSelect from "react-select";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LinkSelect({
  options,
  defaultValue,
  className,
}: {
  options: {
    value: string | number;
    label: string;
    link: string;
  }[];
  defaultValue: string | number;
  className?: string;
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
      className={className}
      options={optionsWithLink}
      defaultValue={optionsWithLink.find((o) => o.value == defaultValue)}
      isSearchable={false}
      onChange={(option) =>
        option && router.replace(option.link, { scroll: false })
      }
    />
  );
}
