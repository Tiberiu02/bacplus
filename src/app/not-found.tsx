// import "../globals.css";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col">
      <Navbar ultimulAnBac={ultimulAnBac} ultimulAnEn={ultimulAnEn} />
      <div className="my-auto flex w-full flex-col items-center justify-center px-4 pt-16">
        <h1 className="text-6xl font-semibold">404</h1>
        <p className="mt-2 text-xl">Pagina nu a fost găsită</p>
      </div>
      <Footer />
    </div>
  );
}
