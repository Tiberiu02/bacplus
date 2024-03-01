import "./globals.css";

import { env } from "~/env.mjs";
import type { Metadata } from "next";

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
  return children;
}
