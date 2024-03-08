"use client";

import { useSearchParams, redirect } from "next/navigation";
import { unidecode } from "~/data/unidecode";

function getRawValue(value: string): string {
  return unidecode(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function DynamicRedirect({
  data,
  paramName,
  fallback,
}: {
  data: {
    value: string;
    redirect: string;
  }[];
  paramName: string;
  fallback: string;
}): null {
  const queryParams = useSearchParams();

  const paramValue = queryParams.get(paramName);

  if (!paramValue) {
    redirect(fallback);
  }

  for (const item of data) {
    if (getRawValue(item.value) === getRawValue(paramValue)) {
      redirect(item.redirect);
    }
  }

  redirect(fallback);
}
