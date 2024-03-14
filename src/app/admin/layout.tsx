"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { trpc } from "~/utils/trpc";
import { FiUser } from "react-icons/fi";
import { useAtom } from "jotai";
import { userDataAtom } from "./userData";
import { PiSignOutBold } from "react-icons/pi";

function RootLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useAtom(userDataAtom);
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
            {userData ? (
              <>
                <div className="border-b-2 border-black border-opacity-0">
                  <FiUser className="mr-2 mt-[-4px] inline" />
                  {userData.name}
                </div>
                <button
                  className="border-b-2 border-black border-opacity-0"
                  onClick={() => setUserData(null)}
                >
                  <PiSignOutBold className="mr-2 mt-[-4px] inline" />
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
