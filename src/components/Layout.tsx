import { Inter } from "next/font/google";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { twMerge } from "tailwind-merge";

import { ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";
import { Analytics } from "~/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={twMerge(inter.className, "flex min-h-screen flex-col")}>
        <Navbar ultimulAnBac={ultimulAnBac} ultimulAnEn={ultimulAnEn} />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
