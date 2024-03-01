// import "../globals.css";
import { Layout } from "~/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex w-full flex-col items-center justify-center px-4 pt-16">
        <h1 className="text-6xl font-semibold">404</h1>
        <p className="mt-2 text-xl">Pagina nu a fost găsită</p>
      </div>
    </Layout>
  );
}
