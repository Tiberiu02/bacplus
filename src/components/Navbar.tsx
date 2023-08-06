"use client";

import Link from "next/link";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { MdMenu, MdOutlineClose } from "react-icons/md";

import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import Image from "next/image";

const PAGES = {
  highshools: {
    name: "Licee",
    path: "/top_licee/${ultimulAnBac}",
  },
  schools: {
    name: "Școli",
    path: "/top_scoli/${ultimulAnEn}",
  },
  counties: {
    name: "Județe",
    path: "/top_judete/${ultimulAnBac}",
  },
  national: {
    name: "Național",
    path: "/national",
  },
  download: {
    name: "Download",
    path: "/download",
  },
  about: {
    name: "Contact",
    path: "/contact",
  },
};

const HOME_PATH = "/";

export function Navbar({
  ultimulAnBac,
  ultimulAnEn,
}: {
  ultimulAnBac: number;
  ultimulAnEn: number;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animationParent] = useAutoAnimate();

  const currentPath = usePathname();
  const activePage = Object.entries(PAGES).find(
    ([_, { path }]) => path.split("/")[1] == currentPath.split("/")[1]
  )?.[0];

  return (
    <nav
      className="z-50 flex flex-col items-center bg-gray-200 drop-shadow-lg"
      ref={animationParent}
    >
      <div
        className={twMerge(
          "flex w-full max-w-6xl flex-col bg-gray-200 px-4 py-5",
          isMenuOpen && "shadow-lg"
        )}
      >
        <div className="flex w-full items-center justify-between">
          <Link href={HOME_PATH} aria-label="Acasă">
            <Image
              className="w-20"
              src="/logo-text.svg"
              alt="Logo"
              width={96.25}
              height={29.726563}
            />
          </Link>
          <button
            className="text-4xl text-gray-700 sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Meniu"
          >
            {isMenuOpen ? <MdOutlineClose /> : <MdMenu />}
          </button>
          <div className="hidden flex-row gap-6 text-gray-600 sm:flex">
            {Object.entries(PAGES).map(([key, { name, path }]) => (
              <Link
                href={path
                  .replaceAll("${ultimulAnBac}", ultimulAnBac.toString())
                  .replaceAll("${ultimulAnEn}", ultimulAnEn.toString())}
                className={
                  key == activePage ? "text-gray-900" : "hover:text-gray-900"
                }
                key={key}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="flex flex-col items-center gap-4 p-4 text-xl text-gray-500 sm:flex-row">
          {Object.entries(PAGES).map(([key, { name, path }]) => (
            <div onClick={() => setIsMenuOpen(false)} key={key}>
              <Link
                href={path
                  .replaceAll("${ultimulAnBac}", ultimulAnBac.toString())
                  .replaceAll("${ultimulAnEn}", ultimulAnEn.toString())}
                className={key == activePage ? "text-gray-800" : ""}
              >
                {name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
