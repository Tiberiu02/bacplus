import LinkButton from "~/components/LinkButton";
import type { PropsWithChildren } from "react";
import {
  FaSchool as FaSchool2,
  FaBriefcase,
  FaUserGraduate,
} from "react-icons/fa";
import { FaSchool } from "react-icons/fa6";
import { LinkText } from "~/components/LinkText";
import { CountUp } from "~/components/CountUp";

import Image from "next/image";

import backgoundImg from "../../public/hero-bg.jpg";
import { Authors } from "~/components/Authors";
import {
  aniBac,
  aniEn,
  queryBac,
  queryEn,
  queryLicee,
  queryScoli,
  querySpecializariBac,
} from "~/data/dbQuery";

function Section({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center px-10 py-12 " +
        (className ? className : "")
      }
    >
      <div className="container flex flex-col gap-4">{children}</div>
    </div>
  );
}

function CountUpCard({
  finalNumber,
  caption,
  duration,
  className,
  Icon,
}: PropsWithChildren<{
  finalNumber: number;
  caption?: string;
  duration: number;
  className?: string;
  Icon: React.ComponentType<{ className?: string }>;
}>) {
  return (
    <div
      className={
        "flex flex-col items-center rounded-lg bg-white p-4 " +
        (className ? className : "")
      }
    >
      <Icon className="text-6xl text-blue-500" />
      <span className="mt-3 font-mono text-3xl">
        <CountUp maxValue={finalNumber} duration={duration} />
      </span>
      <span className="text-lg">{caption}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <div className="relative min-h-screen min-w-full">
        <Image
          src={backgoundImg}
          alt="background"
          className="absolute left-0 top-0 z-0 h-screen w-screen overflow-hidden object-cover"
        />
        <div className="absolute flex min-h-screen min-w-full flex-row items-center justify-center bg-white/70">
          <div className="flex max-w-3xl flex-col gap-4 p-4">
            <h1 className="text-center text-4xl font-extrabold [word-spacing:0.5rem] sm:text-5xl">
              TRANSPARENȚĂ ÎN&nbsp;EDUCAȚIE
            </h1>
            <h5 className="text-center text-xl font-medium">
              Sporim transparența examenelor de Bacalaureat și Evaluare
              Națională prin statistici la nivel de liceu, școală generală,
              județ sau țară, precum și clasamente ale liceelor, școlilor
              generale și județelor.
            </h5>
            <div className="flex flex-row justify-center gap-2">
              <LinkButton
                className="flex w-24 justify-center"
                href={`/top_licee/${aniBac[0] ?? ""}`}
              >
                Licee
              </LinkButton>
              <LinkButton
                className="flex w-24 justify-center"
                href={`/top_scoli/${aniEn[0] ?? ""}`}
              >
                Școli
              </LinkButton>
            </div>
          </div>
        </div>
      </div>

      <Section>
        <h2 className="text-3xl font-bold">De Ce?</h2>

        <blockquote className="">
          <p className="text-xl">
            Investiția în educație plătește mereu cea mai bună dobândă.
          </p>
          <footer className="text-gray-500">
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
          Anual, pe{" "}
          <LinkText href="http://bacalaureat.edu.ro">site-ul</LinkText> oferit
          de Ministerul Educației sunt disponibile listele cu rezultatele
          fiecărui candidat. Se mai publică și un raport care analizează aceste
          rezultate. Publicarea rezultatelor online a constituit un pas
          important în procesul de digitalizare. Noi ne-am propus să ducem
          digitalizarea la nivelul următor prin sintetizarea și publicarea de
          date statistice precum clasamentele județelor și ale liceelor, dar și
          informații detaliate despre fiecare județ și liceu.
        </p>

        <p>
          Pe acest site, ne-am dorit să oferim o perspectivă amplă asupra
          educației în România prin grafice și tabele interactive care prezintă
          informațiile cele mai importante într-un mod ușor de înțeles.
        </p>
      </Section>

      <Section className="bg-gray-200">
        <h2 className="text-3xl font-bold">Datele Noastre</h2>

        <p>Statisticile noastre au fost sintetizate folosind date despre</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CountUpCard
            caption="Candidați"
            finalNumber={
              queryBac.reduce((acc, e) => acc + e._count._all, 0) +
              queryEn.reduce((acc, e) => acc + e._count._all, 0)
            }
            duration={2500}
            className="basis-1/4"
            Icon={FaUserGraduate}
          />
          <CountUpCard
            caption="Licee"
            finalNumber={queryLicee.length}
            duration={3000}
            className="basis-1/4"
            Icon={FaSchool}
          />
          <CountUpCard
            caption="Școli generale"
            finalNumber={queryScoli.length}
            duration={3500}
            className="basis-1/4"
            Icon={FaSchool2}
          />
          <CountUpCard
            caption="Specializări"
            finalNumber={
              new Set(
                querySpecializariBac.map((e) =>
                  e.specializare
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toUpperCase()
                )
              ).size
            }
            duration={4000}
            className="basis-1/4"
            Icon={FaBriefcase}
          />
        </div>
      </Section>
      <Section className="">
        <h2 className="text-3xl font-bold">Câteva Cuvinte Despre Noi</h2>

        <p>
          După ani petrecuți în sistemul educațional, am ajuns să îl cunoaștem
          îndeaproape, cu bune și cu rele.
        </p>

        <p>
          Suntem doi tineri programatori dornici să aducă o schimbare pozitivă
          asupra sistemului în care s-au format. Credem în tehnologie și în
          potențialul acesteia de a revoluționa actul educațional. Modurile în
          care tehnologia poate îmbunătăți sistemul actual sunt infinite, dar am
          ales să începem cu transparentizarea examenului de bacalaureat.
        </p>

        <p>
          Suntem conștienți că publicarea acestor statistici reprezintă doar un
          pas mic. De aceea, ne dorim să extindem platforma și în alte arii ale
          examenului de bacalaureat (pe termen scurt) sau ale educației (pe
          termen lung).
        </p>

        <Authors />
      </Section>
    </main>
  );
}
