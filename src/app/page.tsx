"use client";

import LinkButton from "@/components/LinkButton";
import { Navbar } from "@/components/Navbar";
import { PropsWithChildren, useState, useEffect } from 'react'
import { FaUser, FaSchool, FaCity, FaBriefcase } from 'react-icons/fa'

import Image from "next/image";
import Link from "next/link";

import backgoundImg from '../../public/hero-bg.jpg';

function Section( { children, className }: PropsWithChildren<{ className?: string }> ){
  return (
    <div className={"py-12 px-10 flex flex-col justify-center items-center " + (className ? className : '')}>
      <div className="container flex flex-col gap-6">
        {children}
      </div>
    </div>
  )
}

function CountUp( { children, finalNumber, caption, duration, className }: PropsWithChildren<{ finalNumber: number, caption?: string, duration: number, className?: string }> ){
  const [value, setValue] = useState( '0' );
  const [start, setStart] = useState( +(new Date()) );

  function update(){
    let x = Math.min( 1, (+(new Date()) - start) / duration );

    setValue( Math.floor( finalNumber * x ).toLocaleString() );

    if( x < 1 )
      setTimeout( update, 25 );
  }

  useEffect( update, [] );

  return (
    <div className={"flex flex-col gap-3 items-center bg-white rounded-lg p-4 " + (className ? className : '')}>
      {children}
      <span className="text-3xl font-mono">{value}</span>
      <span className="text-md">{caption}</span>
    </div>
  )
}

export default function Home() {
  return (
    <main>
      <Navbar />

      <div className="min-w-full min-h-screen relative">
        <Image src={backgoundImg} alt="background" className="absolute top-0 left-0 object-cover overflow-hidden h-screen w-screen z-0"/>
        <div className="min-w-full min-h-screen absolute flex flex-row justify-center items-center z-10 bg-white/60">
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
              <LinkButton>Licee</LinkButton>
              <LinkButton>Judete</LinkButton>
            </div>
          </div>
        </div>
      </div>

      <Section id="about">
        <h2 className="text-3xl font-bold">
          De Ce?
        </h2>

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
          Anual, pe <a className="text-blue-500 hover:underline" href="http://bacalaureat.edu.ro">site-ul</a> oferit de
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
      </Section>

      <Section className="bg-gray-200">
        <h2 className="text-3xl font-bold">
          Datele Noastre
        </h2>

        <p>Statisticile noastre au fost compilate folosind date despre</p>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          <CountUp caption="Candidați" finalNumber={1287870} duration={2500} className="basis-1/4">
            <FaUser className="text-4xl text-blue-500"/>
          </CountUp>
          <CountUp caption="Licee" finalNumber={1467} duration={3000} className="basis-1/4">
            <FaSchool className="text-4xl text-blue-500"/>
          </CountUp>
          <CountUp caption="Județe" finalNumber={42} duration={3500} className="basis-1/4">
            <FaCity className="text-4xl text-blue-500"/>
          </CountUp>
          <CountUp caption="Specializări" finalNumber={70} duration={4000} className="basis-1/4">
            <FaBriefcase className="text-4xl text-blue-500"/>
          </CountUp>
        </div>
      </Section>
      <Section id="about" className="">
        <h2 className="text-3xl font-bold">
          Câteva Cuvinte Despre Noi
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
      </Section>
    </main>
  );
}
