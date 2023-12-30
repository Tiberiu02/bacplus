"use client";

import { useState } from "react";
import { FaMagnifyingGlass, FaRegPenToSquare } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { DateLicee, Ierarhie } from "./data";
import { judetDupaCod } from "~/data/coduriJudete";
import unidecode from "unidecode";
import { Card } from "~/components/Cards";
import { FaSchool } from "react-icons/fa";
import { groupBy } from "~/data/groupBy";
import { PercentageBar } from "~/components/PercentageBar";

function numeLiceu(id: string) {
  const nume = id.split("_");
  const judet = judetDupaCod(nume.at(-1)!).nume;
  return nume.slice(0, -1).join(" ") + ", " + judet;
}

function keyLiceu(id: string) {
  const nume = id.split("_");
  const judet = judetDupaCod(nume.at(-1)!).nume;
  return nume.slice(0, -1).join("") + judet;
}

export function CalculatorAdmitere({
  ierarhie,
  licee,
  anCurent,
}: {
  ierarhie: Ierarhie;
  licee: DateLicee;
  anCurent: number;
}) {
  const [medie, setMedie] = useState<string>("");
  const medieNumber = parseFloat(medie.replace(",", "."));
  const medieValid =
    !Number.isNaN(medieNumber) && medieNumber >= 1 && medieNumber <= 10;

  const [search, setSearch] = useState<string>("");
  const searchKey = unidecode(search.toUpperCase()).replace(/[^A-Z]/g, "");

  const [liceuSelectat, setLiceuSelectat] = useState<string | undefined>();

  const liceeFiltered = Object.entries(licee)
    .filter(([liceu]) => keyLiceu(liceu).includes(searchKey))
    .slice(0, 5);

  function updateMedie(newMedie: string) {
    newMedie = newMedie.replace(".", ",").replace(/[^0-9,]/g, "");
    if (newMedie.split(",").length > 2) return;
    if (newMedie[0] == "," || newMedie[0] == "0") return;
    if (newMedie.length > 5) return;
    setMedie(newMedie);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg font-semibold">Medie admitere 2024</div>

      <div
        className={twMerge(
          "flex h-10 items-center gap-4 rounded border-[1px] border-gray-300 px-3 text-black transition-all duration-200 focus-within:border-blue-700 hover:border-blue-700",
          medie.length && !medieValid && "!border-red-500"
        )}
      >
        <FaRegPenToSquare className="shrink-0 text-gray-400" />
        <input
          className="w-full bg-transparent outline-none"
          placeholder={"Scrie media ta aici (ex: 7,11)"}
          value={medie}
          onChange={(e) => updateMedie(e.target.value)}
        />
      </div>

      <div className="mt-4 text-lg font-semibold">Liceu dorit</div>

      <div className="relative flex h-10 items-center gap-4 rounded border-[1px] border-gray-300 px-3 text-black transition-all duration-200 focus-within:border-blue-700 hover:border-blue-700">
        <FaMagnifyingGlass className="shrink-0 text-gray-400" />
        <input
          className="w-full bg-transparent outline-none"
          placeholder="Caută liceul dorit"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search.length > 0 && (
          <div className="absolute left-0 right-0 top-[100%] z-10 mt-1 flex flex-col items-start rounded border-[1px] border-gray-300 bg-white">
            {liceeFiltered.length ? (
              liceeFiltered.map(([liceu, date]) => (
                <button
                  key={liceu}
                  className="w-full cursor-pointer px-3 py-2 text-left duration-150 hover:bg-gray-100"
                  onClick={() => {
                    setLiceuSelectat(liceu);
                    setSearch("");
                  }}
                >
                  {numeLiceu(liceu)}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 italic text-gray-500">
                Nu a fost găsit niciun liceu
              </div>
            )}
          </div>
        )}
      </div>

      {liceuSelectat && medieValid && (
        <InfoLiceu
          idLiceu={liceuSelectat}
          medie={medieNumber}
          licee={licee}
          ierarhie={ierarhie}
          anCurent={anCurent}
        />
      )}
    </div>
  );
}

function InfoLiceu({
  idLiceu,
  medie,
  licee,
  ierarhie,
  anCurent,
}: {
  idLiceu: string;
  medie: number;
  licee: DateLicee;
  ierarhie: Ierarhie;
  anCurent: number;
}) {
  const liceu = licee[idLiceu];
  const judet = judetDupaCod(idLiceu.split("_").at(-1)!);

  const pozitie =
    (ierarhie[judet.id]![Math.round(medie * 100 - 100) + 1] ?? 0) + 1;
  const egalitate =
    (ierarhie[judet.id]![Math.round(medie * 100 - 100)] ?? 0) - pozitie;

  return (
    <Card className="mt-4">
      <div className="flex items-center gap-4 font-bold">
        <FaSchool className="inline shrink-0 text-2xl text-blue-500 opacity-60" />{" "}
        {numeLiceu(idLiceu)}
      </div>

      <div className="mt-4">
        Poziția ta în ierarhia {judet.numeIntreg} {anCurent}: <b>{pozitie}</b>
        {egalitate > 0 && ` (la egalitate cu încă ${egalitate} elevi)`}
      </div>

      {groupBy(liceu!, (s) => s.specializare).map(([specializare, lista]) => (
        <div className="mt-6" key={specializare}>
          <div className="font-bold">{specializare}</div>
          <ul className="ml-4 mt-2 list-inside list-disc">
            {lista.map((a) => (
              <li key={`${a.an}-${a.specializare}`}>
                Ultima poziție {a.an}:{" "}
                <span className="font-medium">{a.pozitie}</span> (medie:{" "}
                {a.medie}, locuri: {a.locuri})
              </li>
            ))}
          </ul>
          <div className="ml-0 mt-2 flex items-center gap-3">
            <div>Șanse de admitere:</div>
            <PercentageBar
              className="inline-block w-20 text-center"
              value={probabilitate(pozitie, lista.at(-1)!.pozitie)}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}

function probabilitate(pozitie: number, ultimaPozitie: number) {
  const diferenta = ultimaPozitie - pozitie;
  let p = normalcdf(0, pozitie / 5, diferenta);
  p = Math.round(p * 100);
  p = Math.max(5, Math.min(95, p));
  return p;
}

function normalcdf(mean: number, sigma: number, to: number) {
  const z = (to - mean) / Math.sqrt(2 * sigma * sigma);
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const erf =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  let sign = 1;
  if (z < 0) {
    sign = -1;
  }
  return (1 / 2) * (1 + sign * erf);
}
