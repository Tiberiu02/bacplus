import type { Metadata } from "next";
import { MainContainer } from "~/components/MainContainer";
import { ShareButtons } from "~/components/ShareButtons";
import { Title } from "~/components/Title";
import { CalculatorAdmitere } from "./CalculatorAdmitere";
import { query, ultimulAnEn } from "~/data/dbQuery";
import type { DateLicee, Ierarhie } from "./data";
import { env } from "~/env.js";

export function generateMetadata(): Metadata {
  return {
    title: `Calculator Admitere ${ultimulAnEn} | Bac Plus`,
    description: `Află ce șanse ai să intri la liceul dorit în funcție de media obținută la Evaluare.`,

    openGraph: {
      title: `Calculator Admitere ${ultimulAnEn}`,
      description:
        "Află ce șanse ai să intri la liceul dorit în funcție de media obținută la Evaluare.",
      siteName: "Bac Plus",
      images: ["/og-banner.webp"],
      url: env.WEBSITE_URL,
    },
  };
}

export default function Calculator() {
  const ierarhie = query.ierarhieAdm.reduce((acc, i) => {
    const { an, id_judet, medie_adm } = i;

    if (!an || !id_judet || !medie_adm) return acc;

    let accAn = acc[an];

    if (!accAn) accAn = acc[an] = {};

    let accJudet = accAn[id_judet];

    if (!accJudet) accJudet = accAn[id_judet] = new Array<number>(901).fill(0);

    const ix = Math.round(medie_adm * 100 - 100);

    if (ix < 0 || ix > 900) {
      console.error(`Invalid index ${ix} for ${i.id_judet}`);
    } else {
      accJudet[ix] = i._count._all;
    }

    return acc;
  }, {} as { [an: number]: Ierarhie });

  Object.entries(ierarhie).forEach(([_an, ierarhie]) => {
    Object.entries(ierarhie).forEach(([_judet, ierarhie]) => {
      for (let i = ierarhie.length - 2; i >= 0; i--) {
        ierarhie[i] += ierarhie[i + 1] || 0;
      }
    });
  });

  const licee = query.specializariAdm.reduce((acc, s) => {
    const liceu = s.repartizat_id_liceu;
    const medie = s._min.medie_adm;

    if (!liceu || !medie) return acc;

    const judet = liceu.split("_").at(-1);

    if (!judet) return acc;

    const pozitie = ierarhie[s.an]?.[judet]?.[Math.round(medie * 100 - 100)];

    if (!pozitie) throw new Error(`No pozitie for ${liceu} ${medie} ${judet}`);

    if (!acc[liceu]) acc[liceu] = [];

    acc[liceu]?.push({
      an: s.an,
      specializare: s.repartizat_specializare || "",
      locuri: s._count._all,
      medie: medie,
      pozitie,
    });

    return acc;
  }, {} as DateLicee);

  const ierarhieUltimulAn = ierarhie[ultimulAnEn];

  if (!ierarhieUltimulAn) throw new Error(`No ierarhie for ${ultimulAnEn}`);

  return (
    <>
      <MainContainer>
        <Title>Calculator Admitere {ultimulAnEn}</Title>
        <p>
          Află ce șanse ai să intri la liceul dorit în funcție de media obținută
          la Evaluare.
        </p>
        <p>
          <b>Cum functionează?</b> După ce introduci media obținută la admitere
          și alegi liceul dorit, calculatorul va calcula poziția ta în ierarhia
          județeană din {ultimulAnEn} și o va compara cu poziția ultimului elev
          admis la liceul respectiv în anul anterior.
        </p>
        <p>
          <b>Atenție!</b> Acest calculator prezintă doar o estimare și nu
          garantează că vei fi admis la liceul dorit. Rezultatele repartizării
          vor fi influențate de alegerile celorlalți elevi, care variază de la
          un an la altul. De asemenea, calculatorul nu poate lua în considerare
          modificări precum specializarile adăugate, eliminate sau cu număr
          modificat de locuri.
        </p>

        <ShareButtons className="my-4" />

        <CalculatorAdmitere
          ierarhie={ierarhieUltimulAn}
          licee={licee}
          anCurent={ultimulAnEn}
        />

        <div className="h-screen" />
      </MainContainer>
    </>
  );
}
