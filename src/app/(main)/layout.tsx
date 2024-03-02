import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";

import { ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar ultimulAnBac={ultimulAnBac} ultimulAnEn={ultimulAnEn} />
      {children}
      <Footer />
    </div>
  );
}
