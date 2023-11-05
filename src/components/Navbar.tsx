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
  national: {
    name: "Național",
    path: "/national",
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
  const isHomePage = currentPath == HOME_PATH;

  console.log(currentPath, isHomePage);

  return (
    <nav
      className={twMerge(
        "z-50 flex flex-col items-center border-b-[1px] border-gray-300 bg-gray-50",
        isHomePage && "fixed left-0 top-0 w-full bg-opacity-90 backdrop-blur-sm"
      )}
      ref={animationParent}
    >
      <div
        className={twMerge(
          "flex w-full max-w-6xl flex-col bg-transparent px-4 py-5",
          isMenuOpen && "border-b-[1px] border-gray-300"
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
                  key == activePage ? "text-black" : "hover:text-black"
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
        <div className="flex flex-col items-center gap-4 p-4 text-xl text-gray-600 sm:flex-row">
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
