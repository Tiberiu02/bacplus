"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { trpc } from "~/utils/trpc";
import { FiUser } from "react-icons/fi";
import { useUserData } from "./userData";
import { PiSignOutBold } from "react-icons/pi";
import { redirect, usePathname } from "next/navigation";
import { LinkSelect } from "~/components/LinkSelect";

const PAGES = {
  sigle: {
    name: "Sigle",
    path: "/admin/sigle",
  },
  imagini: {
    name: "Imagini",
    path: "/admin/photos",
  },
  contributii: {
    name: "Contribuții",
    path: "/admin/stats",
  },
} as { [key: string]: { name: string; path: string } };

function RootLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData, isLoading] = useUserData();
  const pathname = usePathname();

  if (isLoading) return null;

  const isLoginPage = pathname === "/admin/login";

  if (!isLoginPage && !userData) {
    redirect("/admin/login");
  }

  const activePage = Object.entries(PAGES).find(
    ([_, { path }]) => path == pathname
  )?.[0];

  console.log("activePage", activePage);

  // if (!activePage) {
  //   redirect("/admin/sigle");
  // }

  return (
    <div className="flex min-h-[100dvh] flex-col text-lg">
      <div className="flex w-full max-w-6xl flex-col self-center bg-transparent px-5 py-5 text-base">
        <div className="flex w-full items-center justify-between">
          <Link
            href={"/"}
            aria-label="Acasă"
            className="flex items-center gap-2"
          >
            <Image
              className="w-16"
              src="/logo-text.svg"
              alt="Logo"
              width={96.25}
              height={29.726563}
            />
          </Link>
          <div className="hidden flex-row gap-8 sm:flex">
            {!isLoginPage && userData ? (
              <>
                <LinkSelect
                  defaultValue={activePage || "sigle"}
                  options={Object.entries(PAGES).map(
                    ([key, { name, path }]) => ({
                      value: key,
                      label: name,
                      link: path,
                    })
                  )}
                  className=""
                />
                <div className="flex items-center ">
                  <FiUser className="mr-2 mt-[-0px] inline" />
                  {userData.name}
                </div>
                <button className="" onClick={() => setUserData(null)}>
                  <PiSignOutBold className="mr-2 mt-[-2px] inline" />
                  Deconectare
                </button>
              </>
            ) : (
              <>
                <Link
                  href={"/admin/sigle"}
                  className={"border-b-2 border-black border-opacity-0"}
                >
                  <FaLock className="mr-2 mt-[-4px] inline" />
                  Admin Zone
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

// export default RootLayout;
export default trpc.withTRPC(RootLayout);
