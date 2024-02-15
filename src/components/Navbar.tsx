"use client";

import Link from "next/link";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { FiMenu, FiX } from "react-icons/fi";

import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import Image from "next/image";

const PAGES = {
  highshools: {
    name: "Licee",
    path: "/top-licee",
  },
  schools: {
    name: "Școli",
    path: "/top-scoli",
  },
  testeEN: {
    name: "Teste\xa0Evaluare",
    path: "https://zecelaen.ro",
    external: true,
  },
} as { [key: string]: { name: string; path: string; external?: boolean } };

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
    ([_, { path, external }]) =>
      !external && path.split("/")[1] == currentPath.split("/")[1]
  )?.[0];
  const isHomePage = false && currentPath == HOME_PATH;

  return (
    <nav
      className={twMerge(
        "z-50 flex flex-col items-center",
        isHomePage &&
          "fixed left-0 top-0 w-full bg-white bg-opacity-90 backdrop-blur-sm"
      )}
      ref={animationParent}
    >
      <div
        className={twMerge(
          "flex w-full max-w-6xl flex-col bg-transparent px-4 py-5"
        )}
      >
        <div className="flex w-full items-center justify-between">
          <Link
            href={HOME_PATH}
            aria-label="Acasă"
            className="flex items-center gap-2 text-lg"
          >
            <Image
              className="hidden w-4"
              src="/logo.svg"
              alt="Logo"
              width={20}
              height={20}
            />
            <Image
              className="w-16"
              src="/logo-text.svg"
              alt="Logo"
              width={96.25}
              height={29.726563}
            />
          </Link>
          <button
            className="text-2xl text-black sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Meniu"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className="hidden flex-row gap-6 sm:flex">
            {Object.entries(PAGES).map(([key, { name, path, external }]) => (
              <Link
                href={path}
                className={twMerge(
                  "border-b-2 border-black border-opacity-0",
                  key == activePage
                    ? "border-opacity-100 font-semibold"
                    : "hover:text-black"
                )}
                target={external ? "_blank" : undefined}
                key={key}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="flex flex-col items-center gap-4 p-4 text-xl sm:flex-row">
          {Object.entries(PAGES).map(([key, { name, path }]) => (
            <div onClick={() => setIsMenuOpen(false)} key={key}>
              <Link
                href={path
                  .replaceAll("${ultimulAnBac}", ultimulAnBac.toString())
                  .replaceAll("${ultimulAnEn}", ultimulAnEn.toString())}
                className={key == activePage ? "text-black" : ""}
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
