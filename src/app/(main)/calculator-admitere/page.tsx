import type { Metadata } from "next";
import { MainContainer } from "~/components/MainContainer";
import { ShareButtons } from "~/components/ShareButtons";
import { Title } from "~/components/Title";
import { CalculatorAdmitere } from "./CalculatorAdmitere";
import { institutii, query, ultimulAnEn } from "~/data/dbQuery";
import type { DateLicee, Ierarhie } from "./data";
import { env } from "~/env.js";
import { LinkText } from "~/components/LinkText";

const NUM_ANI_AFISATI = 2;

export function generateMetadata(): Metadata {
  return {
    title: `Calculator Admitere ${ultimulAnEn}`,
    description: `Află ce șanse ai să intri la liceul dorit în funcție de media obținută la Evaluare.`,

    openGraph: {
      title: `Calculator Admitere ${ultimulAnEn} – Ce șanse ai să intri la liceul dorit?`,
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
    const { an, unitate_cod_judet, medie_adm } = i;

    if (!an || !unitate_cod_judet || !medie_adm) return acc;

    let accAn = acc[an];

    if (!accAn) accAn = acc[an] = {};

    let accJudet = accAn[unitate_cod_judet];

    if (!accJudet)
      accJudet = accAn[unitate_cod_judet] = new Array<number>(901).fill(0);

    const ix = Math.round(medie_adm.toNumber() * 100 - 100);

    if (ix < 0 || ix > 900) {
      console.error(`Invalid index ${ix} for ${unitate_cod_judet}`);
    } else {
      accJudet[ix] = i._count._all;
    }

    return acc;
  }, {} as { [an: number]: Ierarhie });

  Object.entries(ierarhie).forEach(([_an, ierarhie]) => {
    Object.entries(ierarhie).forEach(([_judet, ierarhie]) => {
      for (let i = ierarhie.length - 2; i >= 0; i--) {
        ierarhie[i] = (ierarhie[i + 1] || 0) + (ierarhie[i] || 0);
      }
    });
  });

  const licee = query.specializariAdm.reduce((acc, s) => {
    const liceu = s.repartizat_liceu_siiir;
    const medie = s._min.medie_adm?.toNumber();

    if (!liceu || !medie || s.an < ultimulAnEn - NUM_ANI_AFISATI) return acc;

    const i = institutii[liceu];

    if (!i) return acc;

    const judet = i.cod_judet;

    if (!judet) return acc;

    const pozitie = ierarhie[s.an]?.[judet]?.[Math.round(medie * 100 - 100)];

    if (!pozitie) throw new Error(`No pozitie for ${liceu} ${medie} ${judet}`);

    if (!acc[liceu])
      acc[liceu] = {
        nume: i.nume,
        codJudet: judet,
        rezultate: [],
      };

    acc[liceu]?.rezultate.push({
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
          Vizitați și pagina{" "}
          <LinkText href="/top-licee">Licee {ultimulAnEn}</LinkText> pentru mai
          multe informații despre liceele din România.
        </p>

        <ShareButtons className="my-4" />

        <p className="-mx-1 mb-4 rounded-xl border-2 border-red-100 bg-red-50 px-3 py-2 font-medium sm:px-4">
          <b>Atenție!</b> Acest calculator prezintă doar o estimare și nu
          garantează admiterea la liceul dorit! Rezultatele repartizării variază
          de la un an la altul. De asemenea, calculatorul nu ține cont de
          criteriile de departajare și nici de specializările modificate față de
          anul precendent.
          <br />
          <span className="underline">
            Nu folosiți acest calculator pentru a decide opțiunile de admitere!
          </span>
        </p>

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
