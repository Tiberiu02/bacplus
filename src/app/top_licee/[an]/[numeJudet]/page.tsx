import { Title } from "~/components/Title";
import { JUDETE } from "~/data/coduriJudete";
import { getTopLicee } from "~/data/topLicee";

import { TabelLicee } from "~/components/TabelLicee";
import { MainContainer } from "~/components/MainContainer";
import { compressLicee } from "~/data/licee";
import { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { an: string; numeJudet: string };
}): Metadata {
  const judet = JUDETE.find((j) => j.nume === params.numeJudet);

  return {
    title: `Top licee ${judet?.numeIntreg} ${params.an}`,
    description: `Classamentul liceelor din ${judet?.numeIntreg} la examenul de Bacalaureat ${params.an}`,
  };
}

export default async function Page({
  params: { an, numeJudet },
}: {
  params: { an: string; numeJudet: string };
}) {
  const judet = JUDETE.find((j) => j.nume === numeJudet);

  if (!judet) {
    return <div>404</div>;
  }

  const topLicee = await getTopLicee(parseInt(an), judet.id);

  return (
    <>
      <MainContainer>
        <Title>
          Clasametul liceelor din {judet.numeIntreg} la examenul de Bacalaureat{" "}
          {an}
        </Title>
        <div>
          <p className="mb-4">
            Liceele pot fi ordonate crescător sau descrescător după rezultatele
            dintr-un anumit an, în funcție de unul dintre următoarele criterii:
          </p>
          <ul className="mb-4 ml-4 list-disc">
            <li className="mb-2">
              <b>MEDIE. </b>
              Media notelor tuturor elevilor din liceul respectiv. Elevii
              neprezentați sau eliminați din examen nu sunt luați în
              considerare.
            </li>
            <li className="mb-2">
              <b>PROCENT DE REUȘITĂ. </b>Procentul elevilor care au depășit nota
              minimă necesară, adică 5 per disciplină, respectiv 6 în total.
              Acest procent este raportat la numărul total de candidați
              înscriși, inclusiv cei absenți și cei eliminați din examen.
            </li>
            <li className="mb-2">
              <b>NUMĂRUL DE CANDIDAȚI. </b>Numărul candidaților care au susținut
              proba la materia respectivă, sau numărul total de candindați.
            </li>
          </ul>
          <p>
            Apăsați pe capetele de tabel pentru a ordona liceele descrescător.
            Apăsați încă o dată pentru a le ordona crescător.
          </p>
        </div>
        <TabelLicee data={compressLicee(topLicee)} />
      </MainContainer>
    </>
  );
}
