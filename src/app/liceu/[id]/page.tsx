import { Component, FC } from "react";
import { FaAward } from "react-icons/fa";
import {
  FaClipboardCheck,
  FaPersonCircleCheck,
  FaSchoolCircleCheck,
  FaUserGraduate,
} from "react-icons/fa6";
import type { IconType } from "react-icons/lib";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import {
  queryBac,
  queryLicee,
  queryMediiAdmLicee,
  queryPromovatiBac,
} from "~/data/dbQuery";
import { formtaNumber } from "~/data/formatNumber";

function Card({
  title,
  value,
  Icon,
}: {
  title: string;
  value: string;
  Icon: IconType;
}) {
  return (
    <div className="flex w-full items-center justify-around gap-1 rounded bg-gray-200 py-3 pl-5 pr-4 shadow">
      <div className="flex flex-col items-center gap-1">
        <div className="text-xs font-bold opacity-50">{title}</div>
        <div className="text-4xl font-bold">{value}</div>
      </div>
      <Icon className="text-5xl text-blue-500 opacity-60" />
    </div>
  );
}

export default function PaginaLiceu({
  params: { id },
}: {
  params: { id: string };
}) {
  const { numeLiceu, codJudet, data, admitere } = getInfoLiceu(id);

  const data0 = Object.entries(data).at(-1);

  if (!data0) return <div>404</div>;

  return (
    <MainContainer>
      <Title>{numeLiceu}</Title>
      <div className="flex grid-cols-2 flex-col gap-4 sm:!grid lg:grid-cols-4">
        <Card
          title={`Medie Bac ${data0[0]}`}
          value={formtaNumber(data0[1].medie, 3)}
          Icon={FaAward}
        />
        <Card
          title={`Promovare ${data0[0]}`}
          value={formtaNumber(data0[1].rataPromovare, 1) + "%"}
          Icon={FaSchoolCircleCheck}
        />
        <Card
          title={`Absolvenți ${data0[0]}`}
          value={formtaNumber(data0[1].candidati, 3)}
          Icon={FaUserGraduate}
        />
        <Card
          title={`Medie Admitere ${admitere[0]?.an}`}
          value={formtaNumber(admitere[0]?._min.medie_adm, 3)}
          Icon={FaPersonCircleCheck}
        />
      </div>
    </MainContainer>
  );
}

function getInfoLiceu(id: string) {
  const codJudet = queryBac.find((result) => result.id_liceu == id)?.id_judet;
  const numeLiceu = queryLicee.find(
    (result) => result.id_liceu == id
  )?.nume_liceu;

  const data = {} as {
    [an: number]: {
      medie?: number;
      candidati: number;
      candidatiValizi: number;
      rataPromovare?: number;
    };
  };

  const admitere = queryMediiAdmLicee
    .filter((result) => result.repartizat_id_liceu == id)
    .sort((a, b) => b.an - a.an);

  queryBac
    .filter((result) => result.id_liceu == id)
    .forEach((result) => {
      data[result.an] = {
        medie: result._avg.my_medie || undefined,
        candidati: result._count._all,
        candidatiValizi: result._count.my_medie,
      };
    });

  queryPromovatiBac
    .filter((result) => result.id_liceu == id)
    .forEach((result) => {
      const d = data[result.an];

      if (d) {
        d.rataPromovare = (result._count._all / d.candidatiValizi) * 100;
      }
    });

  return {
    numeLiceu,
    codJudet,
    data,
    admitere,
  };
}
