"use client";

import Link from "next/link";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { MdMenu, MdOutlineClose } from "react-icons/md";

const PAGES = {
  highshools: {
    name: "Licee",
    path: "/licee",
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

export function Navbar({ activePage }: { activePage?: keyof typeof PAGES }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animationParent] = useAutoAnimate();

  return (
    <nav
      className="bg-gray-200 flex flex-col items-center drop-shadow-lg"
      ref={animationParent}
    >
      <div
        className={
          "flex flex-col max-w-6xl w-full p-4 bg-gray-200 " +
          (isMenuOpen && "shadow-lg")
        }
      >
        <div className="flex w-full justify-between items-center">
          <Link href={HOME_PATH}>
            <img className="w-20" src="/logo-text.svg" alt="Logo" />
          </Link>
          <button
            className="text-4xl sm:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <MdOutlineClose /> : <MdMenu />}
          </button>
          <div className="sm:flex flex-row gap-4 text-gray-500 hidden">
            {Object.entries(PAGES).map(([key, { name, path }]) => (
              <Link
                href={path}
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
        <div className="flex sm:flex-row flex-col gap-4 text-gray-500 text-xl items-center p-4">
          {Object.entries(PAGES).map(([key, { name, path }]) => (
            <Link
              href={path}
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
