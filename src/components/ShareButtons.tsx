"use client";

import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
} from "react-share";

import { FaWhatsapp, FaFacebook, FaFacebookMessenger } from "react-icons/fa";

import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

export function ShareButtons() {
  const className =
    "flex items-center gap-2 rounded-lg px-3 py-[0.6rem] text-sm font-semibold text-white duration-100";

  const [url, setUrl] = useState("https://bacplus.ro");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <WhatsappShareButton url={url}>
        <div className={twMerge(className, "bg-[#25D366] hover:bg-[#55e489]")}>
          <FaWhatsapp className="text-xl" />
          Share
        </div>
      </WhatsappShareButton>
      <FacebookShareButton url={url}>
        <div className={twMerge(className, "bg-[#4267B2] hover:bg-[#6286ce]")}>
          <FaFacebook className="text-xl" />
          Share
        </div>
      </FacebookShareButton>
      <FacebookMessengerShareButton url={url} appId="291494419107518">
        <div className={twMerge(className, "bg-[#008cff] hover:bg-[#42aaff]")}>
          <FaFacebookMessenger className="text-xl" />
          Share
        </div>
      </FacebookMessengerShareButton>
    </div>
  );
}
