import "../globals.css";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";

import { ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";
import { Navbar } from "~/components/Navbar";
import { Analytics } from "~/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          inter.className,
          "flex h-[100dvh] flex-col bg-[#DDD]"
        )}
      >
        <Navbar
          ultimulAnBac={ultimulAnBac}
          ultimulAnEn={ultimulAnEn}
          isOverlay
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
