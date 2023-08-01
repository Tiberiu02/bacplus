"use client";

import Link from "next/link";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { MdMenu, MdOutlineClose } from "react-icons/md";

import { twMerge } from "tailwind-merge";

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
    path: "/judete",
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
  activePage,
  ultimulAnBac,
  ultimulAnEn,
}: {
  activePage?: keyof typeof PAGES;
  ultimulAnBac: number;
  ultimulAnEn: number;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animationParent] = useAutoAnimate();

  return (
    <nav
      className="z-50 flex flex-col items-center bg-gray-200 drop-shadow-lg"
      ref={animationParent}
    >
      <div
        className={twMerge(
          "flex w-full max-w-6xl flex-col bg-gray-200 p-4 ",
          isMenuOpen && "shadow-lg"
        )}
      >
        <div className="flex w-full items-center justify-between">
          <Link href={HOME_PATH}>
            <img className="w-20" src="/logo-text.svg" alt="Logo" />
          </Link>
          <button
            className="text-4xl text-gray-700 sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <MdOutlineClose /> : <MdMenu />}
          </button>
          <div className="hidden flex-row gap-4 text-gray-500 sm:flex">
            {Object.entries(PAGES).map(([key, { name, path }]) => (
              <Link
                href={path
                  .replaceAll("${ultimulAnBac}", ultimulAnBac.toString())
                  .replaceAll("${ultimulAnEn}", ultimulAnEn.toString())}
                className={
                  key == activePage ? "text-gray-800" : "hover:text-gray-800"
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
            <Link
              href={path
                .replaceAll("${ultimulAnBac}", ultimulAnBac.toString())
                .replaceAll("${ultimulAnEn}", ultimulAnEn.toString())}
              key={key}
              className={key == activePage ? "text-gray-800" : ""}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
