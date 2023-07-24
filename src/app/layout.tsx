import "./globals.css";
import { Inter } from "next/font/google";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { twMerge } from "tailwind-merge";

import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primereact/resources/primereact.css"; // core css
import "primeicons/primeicons.css"; // icons
import "primeflex/primeflex.css"; // css utility
import { aniBac, aniEn } from "~/data/dbQuery";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BacPlus",
  icons: ["/favicon.ico"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={twMerge(inter.className, "flex min-h-screen flex-col")}>
        <Navbar ultimulAnBac={aniBac[0] ?? 0} ultimulAnEn={aniEn[0] ?? 0} />
        {children}
        <div className="m-4"></div>
        <Footer />
      </body>
    </html>
  );
}
