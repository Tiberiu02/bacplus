import LinkButton from "@/components/Button";
import { Navbar } from "@/components/Navbar";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="min-w-full min-h-screen flex flex-row justify-center items-center">
        <div className="max-w-prose flex flex-col gap-2">
          <h1 className="font-extrabold text-center text-5xl">
            TRANSPARENȚĂ LA&nbsp;BAC
          </h1>
          <h5 className="text-xl text-center">
            Sporim transparența examenului de bacalaureat prin statistici la
            nivel de liceu, județ sau țară, precum și clasamente ale liceelor și
            județelor.
          </h5>
          <div className="flex flex-row gap-2 justify-center">
            <LinkButton></LinkButton>
            <Link
              className="text-xl text-blue-500 rounded-md hover:bg-blue-500 hover:text-white px-2 border-2 border-blue-500 transition duration-200"
              href={"/"}
            >
              Licee
            </Link>
          </div>
        </div>
      </div>
      <section id="about" className="mt-5">
        <div className="container">
          <h2 className="mb-4">
            <b>De Ce?</b>
          </h2>
          <blockquote className="blockquote">
            <p className="mb-0">
              Investiția în educație plătește mereu cea mai bună dobândă.
            </p>
            <footer className="blockquote-footer">
              Benjamin Franklin în{" "}
              <cite title="The Way to Wealth: Ben Franklin on Money and Success">
                The Way to Wealth
              </cite>
            </footer>
          </blockquote>
          <p>
            Bacalaureatul este cel mai important examen din sistemul educațional
            românesc. Totodată, rezultatele la bac reprezintă singurele date
            numerice disponibile care reflectă situația învățământului la nivel
            național.
          </p>
          <p>
            Anual, pe <a href="http://bacalaureat.edu.ro">site-ul</a> oferit de
            Ministerul Educației sunt disponibile listele cu rezultatele
            fiecărui candidat. Se mai publică și un raport care analizează
            aceste rezultate. Publicarea rezultatelor online a constituit un pas
            important în procesul de digitalizare. Noi ne-am propus să ducem
            digitalizarea la nivelul următor prin sintetizarea și publicarea de
            date statistice precum clasamentele județelor și ale liceelor, dar
            și informații detaliate despre fiecare județ și liceu.
          </p>
          <p>
            Pe acest site, ne-am dorit să oferim o perspectivă amplă asupra
            educației în România prin grafice și tabele interactive care
            prezintă informațiile cele mai importante într-un mod ușor de
            înțeles.
          </p>
        </div>
      </section>
      <section
        id="numbers"
        className="pt-5 mt-5 pb-3"
        style={{ backgroundColor: "#EEE" }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>
                <b>Datele Noastre</b>
              </h2>
              <p>Statisticile noastre au fost compilate folosind date despre</p>
            </div>
          </div>
          <div className="row text-center mb-3">
            <div className="col-sm-6 col-lg-3 mb-3">
              <div className="counter">
                <i className="fa fa-user fa-2x"></i>
                <h2
                  className="timer count-title count-number"
                  data-to="1287870"
                  data-speed="2500"
                >
                  0
                </h2>
                <p className="count-text ">Candidați</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3 mb-3">
              <div className="counter">
                <i className="fa fa-school fa-2x"></i>
                <h2
                  className="timer count-title count-number"
                  data-to="1467"
                  data-speed="3000"
                >
                  0
                </h2>
                <p className="count-text ">Licee</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3 mb-3">
              <div className="counter">
                <i className="fa fa-city fa-2x"></i>
                <h2
                  className="timer count-title count-number"
                  data-to="42"
                  data-speed="3500"
                >
                  0
                </h2>
                <p className="count-text ">Județe</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3 mb-3">
              <div className="counter">
                <i className="fa fa-briefcase fa-2x"></i>
                <h2
                  className="timer count-title count-number"
                  data-to="70"
                  data-speed="4000"
                >
                  0
                </h2>
                <p className="count-text ">Specializări</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="mt-5">
        <div className="container">
          <h2 className="mb-4">
            <b>Câteva Cuvinte Despre Noi</b>
          </h2>
          <p>
            După ani petrecuți în sistemul educațional, am ajuns să îl cunoaștem
            îndeaproape, cu bune și cu rele.
          </p>
          <p>
            Suntem o echipă de tineri programatori dornici să aducă o schimbare
            pozitivă asupra sistemului în care s-au format. Credem în tehnologie
            și în potențialul acesteia de a revoluționa actul educațional.
            Modurile în care tehnologia poate îmbunătăți sistemul actual sunt
            infinite, dar am ales să începem cu transparentizarea examenului de
            bacalaureat.
          </p>
          <p>
            Suntem conștienți că publicarea acestor statistici reprezintă doar
            un pas mic. De aceea, ne dorim să extindem platforma și în alte arii
            ale examenului de bacalaureat (pe termen scurt) sau ale educației
            (pe termen lung).
          </p>
        </div>
      </section>{" "}
    </main>
  );
}
