import { prisma } from "~/server/db";

async function getTopLicee() {
  const licee = {} as any;

  (
    await prisma.bac.groupBy({
      by: ["id_judet", "an"],
      _count: {
        my_medie: true,
      },
      _avg: {
        my_medie: true,
      },
    })
  ).forEach((result) => {
    if (result.id_judet === null) return;

    if (licee[result.an] === undefined) {
      licee[result.an] = {};
    }

    if (licee[result.an][result.id_judet] === undefined) {
      licee[result.an][result.id_judet] = {
        medie: result._avg.my_medie,
        candidati: result._count.my_medie,
        promovati: 0,
      };
    }
  });

  (
    await prisma.bac.groupBy({
      by: ["id_judet", "an"],
      _count: {
        _all: true,
      },
      where: {
        rezultat: "REUSIT",
      },
    })
  ).forEach((result) => {
    if (result.id_judet === null) return;

    licee[result.an][result.id_judet].promovati = result._count._all;
  });

  return licee;
}

export default async function Page() {
  const top_licee = await getTopLicee();

  return (
    <div className="p-4">
      {Object.entries(top_licee[2023]).map(
        ([id_judet, { medie, candidati, promovati }], ix) => (
          <p key={ix}>{`${id_judet} - medie ${
            Math.round(medie * 100) / 100
          }, promovare ${
            Math.round((promovati / candidati) * 100 * 10) / 10
          }%`}</p>
        )
      )}
    </div>
  );
}
