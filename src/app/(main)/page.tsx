import LinkButton from "~/components/LinkButton";
import type { PropsWithChildren } from "react";
import { FaSchool as FaSchool2, FaUserGraduate } from "react-icons/fa";
import { FaSchool } from "react-icons/fa6";
import { LinkText } from "~/components/LinkText";
import { CountUp } from "~/components/CountUp";
import { bacData, query, ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";
import { env } from "~/env.js";
import { MainContainer } from "~/components/MainContainer";
import { VerticalTrack } from "~/components/VerticalTrack";
import Link from "next/link";
import { getUrlFromId } from "~/data/institutie/urlFromId";

function Section({
  children,
  title,
  className,
}: PropsWithChildren<{ title: string; className?: string }>) {
  return (
    <div
      className={
        "flex flex-col gap-4 px-2 pt-16 " + (className ? className : "")
      }
    >
      <h2 className="mb-2 text-2xl font-bold [text-wrap:balance] sm:mb-4 sm:text-3xl">
        {title}
      </h2>
      {children}
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
    <div className={"flex items-center gap-6 " + (className ? className : "")}>
      <Icon className="shrink-0 text-4xl text-blue-500" />
      <div className="flex flex-col">
        <span className="font-mono text-2xl">
          <CountUp maxValue={finalNumber} duration={duration} />
        </span>
        <span className="text-lg">{caption}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <div className="bg-polka relative flex h-[calc(100svh-4rem-2px)] min-w-full flex-col items-center">
        <div className="h-full"></div>
        <div className="flex max-w-3xl flex-col gap-4 p-4">
          <h1 className="text-center text-4xl font-extrabold [text-wrap:balance] [word-spacing:0.3rem] sm:text-5xl">
            Educația în cifre
          </h1>
          <h2 className="text-center text-xl font-medium [text-wrap:balance]">
            Descoperă sistemul educațional românesc cu ajutorul datelor oficiale
          </h2>
          <div className="flex flex-row justify-center gap-2">
            <LinkButton
              className="flex w-24 justify-center"
              href={`/top-licee`}
            >
              Licee
            </LinkButton>
            <LinkButton
              className="flex w-24 justify-center"
              href={`/top-scoli`}
            >
              Școli
            </LinkButton>
          </div>
        </div>
        <div className="h-full"></div>

        <VerticalTrack className="shrink-0 gap-5 bg-white py-3 pl-3">
          {bacData
            .filter(
              (a) => a.an == ultimulAnBac && a._avg.medie && a.data?.sigla_xs
            )
            .sort(
              (a, b) =>
                (b._avg.medie?.toNumber() ?? 0) -
                (a._avg.medie?.toNumber() ?? 0)
            )
            .slice(0, 50)
            .map((a) => (
              <Link
                href={`/i/${getUrlFromId(a.unitate_siiir || "")}`}
                key={a.unitate_siiir}
                className="h-8 w-8 shrink-0"
                target="_blank"
              >
                <img
                  src={`https://assets.bacplus.ro/institutii/${
                    a.unitate_siiir || ""
                  }/sigla-xs.webp`}
                  className="h-8 w-8"
                />
              </Link>
            ))}
        </VerticalTrack>
      </div>

      <MainContainer>
        <Section title="De ce?">
          <blockquote className="border-l-4 border-gray-300 pl-4">
            <q className="text-xl italic">
              Educația este cea mai puternică armă pe care o poți folosi pentru
              a schimba lumea.
            </q>
            <footer className="text-gray-500">
              Nelson Mandela în{" "}
              <LinkText
                href="https://www.youtube.com/watch?v=e6X5rCyQqn0"
                target="_blank"
              >
                discursul
              </LinkText>{" "}
              ținut la lansarea „Mindset Network”, 16 iulie 2003
            </footer>
          </blockquote>

          <p>
            Bacalaureatul este cel mai important examen din sistemul educațional
            românesc. Notele la examenele naționale nu oferă o imagine completă
            asupra situației învățământului la nivel național, dar ele
            reprezintă singurele date numerice disponibile în România. De aceea,
            este important ca aceste date să fie studiate și valorificate.
          </p>
          <p>
            Acest site vine în ajutorul elevilor, părinților și profesorilor
            care vor să se informeze asupra situației învățământului din România
            cu ajutorul datelor oficiale publicate de Ministerul Educației
            Naționale.
          </p>
        </Section>

        <Section title="Datele noastre">
          <p>
            Toate datele de pe acest site au fost sintetizate folosind
            informații publicate de Ministerul Educației Naționale pe{" "}
            <LinkText
              target="_blank"
              href="https://data.gov.ro/en/organization/men"
            >
              data.gov.ro
            </LinkText>
            ,{" "}
            <LinkText target="_blank" href="http://bacalaureat.edu.ro/2023/">
              bacalaureat.edu.ro
            </LinkText>
            ,{" "}
            <LinkText target="_blank" href="http://admitere.edu.ro/">
              admitere.edu.ro
            </LinkText>
            {" și "}
            <LinkText target="_blank" href="http://evaluare.edu.ro/">
              evaluare.edu.ro.
            </LinkText>
          </p>
          <p>
            În vederea realizării tuturor statisticilor de pe acest site, am
            creat o baza de date unificată cu toate datele disponibile pe
            site-urile menționate mai sus. Am decis să facem publică această
            bază de date pentru ca oricine să își poată sintetiza propriile
            statistici cu ușurință. Această bază de date este disponibilă în
            formatul SQLite și poate fi descărcată de{" "}
            <LinkText href={env.DB_DOWNLOAD_URL} target="_blank">
              aici
            </LinkText>
            . Pentru a putea lucra cu această bază de date, vă recomandăm
            programul gratuit{" "}
            <LinkText href="https://sqlitestudio.pl/" target="_blank">
              SQLiteStudio
            </LinkText>
            . Va fi nevoie să cunoașteți limbajul de interogare a bazelor de
            date SQL (Standard Query Language). Vă recomandăm{" "}
            <LinkText href="https://www.w3schools.com/sql" target="_blank">
              acest tutorial SQL gratuit
            </LinkText>
            .
          </p>

          <p>
            De asemenea, facem publice programele create de noi pentru a
            descărca rezultatele și a crea această bază de date unificată. Le
            puteți accesa pe GitHub{" "}
            <LinkText
              href="https://github.com/Tiberiu02/bacplus-data"
              target="_blank"
            >
              aici
            </LinkText>
            . Dacă decideți să publicați statistici realizate cu ajutorul bazei
            noastre de date sau alte statistici preluate de pe acest site, vă
            rugăm să menționați sursa cu link.
          </p>

          <div className="m-2 flex flex-row flex-wrap gap-24 gap-y-8">
            <CountUpCard
              caption="Licee"
              finalNumber={query.bac.filter((a) => a.an == ultimulAnBac).length}
              duration={1000}
              Icon={FaSchool}
            />
            <CountUpCard
              caption="Gimnazii"
              finalNumber={query.en.filter((a) => a.an == ultimulAnEn).length}
              duration={2000}
              Icon={FaSchool2}
            />
            <CountUpCard
              caption="Elevi"
              finalNumber={
                query.bac.reduce((acc, e) => acc + e._count._all, 0) +
                query.en.reduce((acc, e) => acc + e._count._all, 0)
              }
              duration={3000}
              Icon={FaUserGraduate}
            />
          </div>
        </Section>
        <Section title="Câteva cuvinte despre noi">
          <p>
            La fel ca oricine a trecut prin sistemul educațional, și noi am
            ajuns să îl cunoaștem îndeaproape, cu bune și cu rele. Am început
            acest proiect în 2021 ca un mic pas în direcția mult mai largă a
            digitalizării sistemului educațional românesc. Există nenumărate
            soluții digitale care, dacă ar fi dezvoltate, ar putea fi de un real
            folos pentru elevii, profesorii și părinții din învățământul
            românesc. Ne dorim ca următoarele generații să beneficieze de o
            educație mai bună.
          </p>
          <p>
            Pentru sugestii, idei, probleme cu site-ul, sau orice altceva, ne
            puteți contacta prin e-mail la adresa{" "}
            <b>
              <i>contact@bacplus.ro.</i>
            </b>{" "}
            Orice feedback este binevenit!
          </p>

          {/* <Authors /> */}
        </Section>
      </MainContainer>
    </main>
  );
}
