import { Title } from "~/components/Title";
import { JUDETE_DUPA_COD } from "~/data/coduriJudete";
import { query } from "~/data/dbQuery";
import { TabelJudete } from "./TabelJudete";
import { MainContainer } from "~/components/MainContainer";
import type { Judet } from "~/data/data";
import type { Metadata } from "next";
import { LinkSelect } from "~/components/LinkSelect";
import { notFound } from "next/navigation";

export function generateMetadata({
  params,
}: {
  params: { an: string };
}): Metadata {
  const { an } = params;

  return {
    title: `Top județe la Bac ${an} | Bac Plus`,
    description: `Descoperă topul județelor la examenul de Bacalaureat ${an}`,
  };
}

export function generateStaticParams() {
  const params = query.aniBac.map(({ an }) => ({
    an: an.toString(),
  }));

  return params;
}

export default function Page({ params }: { params: { an: string } }) {
  const { an } = params;

  if (!an) notFound();

  const judete = getJudete(parseInt(an));

  const optionsAni = query.aniBac.map(({ an }) => ({
    value: `${an}`,
    label: `${an}`,
    link: `/top_judete/${an}`,
  }));

  return (
    <>
      <MainContainer>
        <Title>Clasamentul județelor la Bacalaureat {an}</Title>
        <div className="mb-4 flex flex-col gap-2">
          <p>
            Acest clasament conține toate județele din România și a fost
            realizat folosind rezultatele oficiale la examenele de Bacalaureat
            și Evaluare Națională publicate de Ministerul Educației Naționale.
          </p>
          <p>
            Apăsați pe capetele de tabel pentru a sorta județele după un anumit
            criteriu.
          </p>
          <p>
            Apăsați pe numele unui județ pentru a vedea mai multe statistici
            despre acesta.
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <LinkSelect defaultValue={an} options={optionsAni} />
          </div>
        </div>
        <TabelJudete data={judete} />
      </MainContainer>
    </>
  );
}

function getJudete(an: number) {
  const judete = {} as {
    [id: string]: Judet;
  };

  query.bacJudete.forEach((result) => {
    if (result.id_judet === null || result.an != an) return;

    judete[result.id_judet] = {
      id: result.id_judet,
      nume: JUDETE_DUPA_COD[result.id_judet]?.nume ?? "",
      numeIntreg: JUDETE_DUPA_COD[result.id_judet]?.numeIntreg ?? "",
      medieBac: result._avg.my_medie ?? undefined,
      numCandidatiBac: result._count._all,
      numCandidatiValiziBac: result._count.my_medie,
      rataPromovareBac: 0,
      medieEn: undefined,
      numCandidatiEn: undefined,
    };
  });

  query.promovatiBac.forEach((result) => {
    if (result.id_judet === null || result.an != an) return;

    const obj = judete[result.id_judet];
    if (obj != undefined) {
      obj.rataPromovareBac += result._count._all / obj.numCandidatiValiziBac;
    }
  });

  query.enJudete.forEach((result) => {
    if (result.id_judet === null || result.an != an) return;

    const obj = judete[result.id_judet];
    if (obj != undefined) {
      obj.medieEn = result._avg.medie_en ?? undefined;
      obj.numCandidatiEn = result._count._all;
    }
  });

  return Object.values(judete);
}
