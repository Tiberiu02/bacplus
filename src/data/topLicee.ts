import { prisma } from "~/server/db";
import { Liceu } from "./licee";

export async function getTopLicee(an?: number, judet?: string) {
  const licee = {} as {
    [id: string]: Liceu;
  };

  (
    await prisma.bac.groupBy({
      by: ["id_liceu", "an"],
      _count: {
        my_medie: true,
      },
      _avg: {
        my_medie: true,
      },
      where: {
        an: an,
        id_judet: judet,
      },
    })
  ).forEach((result) => {
    if (result.id_liceu === null) return;

    licee[result.id_liceu] = {
      id: result.id_liceu,
      medieBac: result._avg.my_medie,
      numCandidati: result._count.my_medie,
      numPromovati: 0,
      rataPromovare: 0,
      numeLiceu: "",
      codJudet: result.id_liceu.split("_").at(-1),
    };
  });

  (
    await prisma.bac.groupBy({
      by: ["id_liceu", "an"],
      _count: {
        _all: true,
      },
      where: {
        rezultat: "REUSIT",
        an: an,
        id_judet: judet,
      },
    })
  ).forEach((result) => {
    if (result.id_liceu === null) return;

    licee[result.id_liceu]!.numPromovati = result._count._all;
    licee[result.id_liceu]!.rataPromovare =
      result._count._all / licee[result.id_liceu]!.numCandidati;
  });

  (
    await prisma.licee.findMany({
      select: {
        id_liceu: true,
        nume_liceu: true,
      },
    })
  ).forEach((liceu) => {
    if (licee[liceu.id_liceu] != undefined) {
      licee[liceu.id_liceu]!.numeLiceu = liceu.nume_liceu;
    }
  });

  return Object.values(licee);
}
