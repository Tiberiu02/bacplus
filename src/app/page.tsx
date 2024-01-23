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

import backgoundImg from "../../public/hero-bg.webp";
import { Authors } from "~/components/Authors";
import { query } from "~/data/dbQuery";
import { env } from "~/env.mjs";

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
        <div className="absolute left-0 top-0 z-0 h-screen w-full overflow-hidden">
          <Image
            src={backgoundImg}
            alt="background"
            className="h-full w-full object-cover blur-sm"
          />
        </div>
        <div className="absolute flex min-h-screen min-w-full flex-row items-center justify-center bg-white/70">
          <div className="flex max-w-3xl flex-col gap-4 p-4">
            <h1 className="text-center text-4xl font-extrabold [word-spacing:0.5rem] sm:text-5xl">
              TRANSPARENȚĂ ÎN&nbsp;EDUCAȚIE
            </h1>
            <h2 className="text-center text-xl font-medium [text-wrap:balance]">
              Sporim transparența examenelor de Bacalaureat și Evaluare
              Națională prin statistici la nivel de liceu si școală generală,
              precum și clasamente ale liceelor și școlilor generale.
            </h2>
            <div className="flex flex-row justify-center gap-2">
              <LinkButton
                className="flex w-24 justify-center"
                href={`/top_licee`}
              >
                Licee
              </LinkButton>
              <LinkButton
                className="flex w-24 justify-center"
                href={`/top_scoli`}
              >
                Școli
              </LinkButton>
            </div>
          </div>
        </div>
      </div>

      <Section>
        <h2 className="text-3xl font-bold">De Ce?</h2>

        <blockquote className="border-l-4 border-gray-300 pl-4">
          <q className="text-xl italic">
            Investiția în educație plătește mereu cea mai bună dobândă.
          </q>
          <footer className="text-gray-500">
            Benjamin Franklin în{" "}
            <q title="The Way to Wealth: Ben Franklin on Money and Success">
              The Way to Wealth
            </q>
          </footer>
        </blockquote>

        <p>
          Bacalaureatul este cel mai important examen din sistemul educațional
          românesc. Notele la examenele naționale nu oferă o imagine completă
          asupra situației învățământului la nivel național, dar ele reprezintă
          singurele date numerice disponibile în România. De aceea, este
          important ca aceste date să fie studiate și valorificate. Acest site
          vine în ajutorul elevilor, părinților și profesorilor care vor să se
          informeze asupra situației învățământului din România cu ajutorul
          datelor oficiale publicate de Ministerul Educației Naționale.
        </p>
      </Section>

      <Section className="bg-gray-150">
        <h2 className="text-3xl font-bold">Datele Noastre</h2>

        <p>
          Toate datele de pe acest site au fost sintetizate folosind informații
          publicate de Ministerul Educației Naționale pe{" "}
          <LinkText
            target="_blank"
            href="http://static.bacalaureat.edu.ro/2023/"
          >
            bacalaureat.edu.ro
          </LinkText>
          ,{" "}
          <LinkText
            target="_blank"
            href="https://data.gov.ro/en/organization/men"
          >
            data.gov.ro
          </LinkText>
          ,{" "}
          <LinkText target="_blank" href="http://static.admitere.edu.ro/">
            admitere.edu.ro
          </LinkText>
          {" și "}
          <LinkText target="_blank" href="http://static.evaluare.edu.ro/">
            evaluare.edu.ro.
          </LinkText>
        </p>
        <p>
          În vederea realizării tuturor statisticilor de pe acest site, am creat
          o baza de date unificată cu toate datele disponibile pe site-urile
          menționate mai sus. Am decis să facem publică această bază de date
          pentru ca oricine să își poată sintetiza propriile statistici cu
          ușurință. Această bază de date este disponibilă în formatul SQLite și
          poate fi descărcată de{" "}
          <LinkText href={env.DB_DOWNLOAD_URL} target="_blank">
            aici
          </LinkText>
          . Pentru a putea lucra cu această bază de date, vă recomandăm
          programul gratuit{" "}
          <LinkText href="https://sqlitestudio.pl/" target="_blank">
            SQLiteStudio
          </LinkText>
          . Va fi nevoie să cunoașteți limbajul de interogare a bazelor de date
          SQL (Standard Query Language). Vă recomandăm{" "}
          <LinkText href="https://www.w3schools.com/sql" target="_blank">
            acest tutorial SQL gratuit
          </LinkText>
          .
        </p>

        <p>
          De asemenea, facem publice programele create de noi pentru a descărca
          rezultatele și a crea această bază de date unificată. Le puteți accesa
          pe GitHub{" "}
          <LinkText
            href="https://github.com/Tiberiu02/bacplus-data"
            target="_blank"
          >
            aici
          </LinkText>
          . Dacă decideți să publicați statistici realizate cu ajutorul bazei
          noastre de date sau alte statistici preluate de pe acest site, vă
          rugăm să menționați sursa (cu link).
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CountUpCard
            caption="Candidați"
            finalNumber={
              query.bac.reduce((acc, e) => acc + e._count._all, 0) +
              query.en.reduce((acc, e) => acc + e._count._all, 0)
            }
            duration={2500}
            className="basis-1/4"
            Icon={FaUserGraduate}
          />
          <CountUpCard
            caption="Licee"
            finalNumber={query.licee.length}
            duration={3000}
            className="basis-1/4"
            Icon={FaSchool}
          />
          <CountUpCard
            caption="Școli generale"
            finalNumber={query.scoli.length}
            duration={3500}
            className="basis-1/4"
            Icon={FaSchool2}
          />
          <CountUpCard
            caption="Specializări"
            finalNumber={
              new Set(
                query.specializariBac.map((e) =>
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
          După cei 12 ani petrecuți în sistemul educațional, am ajuns să îl
          cunoaștem îndeaproape, cu bune și cu rele. Am început acest proiect în
          2021 ca un mic pas în direcția mult mai largă a digitalizării
          sistemului educațional românesc. Există nenumărate moduri în care
          tehnologia poate amplifica potențialul fiecărui elev și profesor.
          Depinde doar de noi ca următoarele generații să beneficieze de o
          educație mai bună.
        </p>
        <p>
          Pentru sugestii, idei, probleme cu platforma, sau orice altceva, ne
          puteți contacta prin e-mail la adresa{" "}
          <b>
            <i>contact@bacplus.ro.</i>
          </b>{" "}
          Orice feedback este binevenit!
        </p>

        <Authors />
      </Section>
    </main>
  );
}
