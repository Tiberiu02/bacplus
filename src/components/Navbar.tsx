"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
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
  harta: {
    name: "Hartă",
    path: "/harta",
  },
  // testeEN: {
  //   name: "Teste\xa0Evaluare",
  //   path: "https://zecelaen.ro",
  //   external: true,
  // },
} as { [key: string]: { name: string; path: string; external?: boolean } };

const HOME_PATH = "/";

export function Navbar({
  ultimulAnBac,
  ultimulAnEn,
  isOverlay,
}: {
  ultimulAnBac: number;
  ultimulAnEn: number;
  isOverlay?: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animationParent] = useAutoAnimate();

  const currentPath = usePathname();
  const activePage = Object.entries(PAGES).find(
    ([_, { path, external }]) =>
      !external && path.split("/")[1] == currentPath.split("/")[1]
  )?.[0];
  const isHomePage = false && currentPath == HOME_PATH;

  const isPrideMonth = new Date().getMonth() == 5 || new Date().getMonth() == 6;

  return (
    <nav
      className={twMerge(
        "z-[1000] flex flex-col items-center bg-white",
        isHomePage &&
          "fixed left-0 top-0 w-full bg-opacity-90 backdrop-blur-sm",
        isOverlay && "shadow"
      )}
      ref={animationParent}
    >
      <div
        className={twMerge(
          "flex w-full max-w-6xl flex-col bg-transparent px-5 py-4",
          isOverlay && "py-4"
        )}
      >
        <div className="flex w-full items-center justify-between">
          <Link
            href={HOME_PATH}
            aria-label="Acasă"
            className="relative flex items-center gap-2 text-lg"
          >
            {isPrideMonth && (
              <div
                className={
                  "bg-rainbow absolute h-full w-full rounded-xl opacity-20"
                }
              />
            )}
            <div className="relative m-[0.3rem] rounded-lg bg-white/40 p-[0.2rem_0.4rem]">
              <Image
                className="relative h-[1.5rem] w-16"
                src="/logo-text.svg"
                alt="Logo"
                width={96.25}
                height={29}
              />
            </div>
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
