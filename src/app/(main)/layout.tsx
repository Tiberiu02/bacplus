import "../globals.css";
import { Inter } from "next/font/google";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { twMerge } from "tailwind-merge";

import { ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";
import { env } from "~/env.mjs";
import type { Metadata } from "next";
import { Analytics } from "~/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(env.WEBSITE_URL),
  title: "BacPlus",
  description:
    "Descoperă statistici despre examenele de Bacalaureat și Evaluare Națională la nivel de liceu, școală generală, județ sau țară, precum și clasamente ale liceelor, școlilor generale și județelor.",
  icons: ["/favicon.ico"],
  viewport: {
    width: "device-width",
    height: "device-height",
    initialScale: 1,
    minimumScale: 1,
  },
  openGraph: {
    title: "Bac Plus",
    description:
      "Descoperă statistici despre examenele de Bacalaureat și Evaluare Națională la nivel de liceu, școală generală, județ sau țară, precum și clasamente ale liceelor, școlilor generale și județelor.",
    siteName: "Bac Plus",
    images: ["/og-banner.jpg"],
    url: env.WEBSITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
