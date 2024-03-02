import { Navbar } from "~/components/Navbar";
import { ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] flex-col bg-[#DDD]">
      <Navbar ultimulAnBac={ultimulAnBac} ultimulAnEn={ultimulAnEn} isOverlay />
      {children}
    </div>
  );
}
