"use client";

import { useState } from "react";
import { Button } from "./Button";
import { FaCheck } from "react-icons/fa6";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      className="ml-4 px-2 py-[2px]"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }}
    >
      {copied ? (
        <>
          <FaCheck className="mr-2 mt-[-2px] inline text-green-500" />
          Copiat
        </>
      ) : (
        "Copiază"
      )}
    </Button>
  );
}
