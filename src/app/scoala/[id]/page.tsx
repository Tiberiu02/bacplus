import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import { query } from "~/data/dbQuery";
import { formtaNumber } from "~/data/formatNumber";
import type { Metadata } from "next";
import { PieChart } from "~/components/PieChart";
import { ChartCard, SnippetCard } from "~/components/Cards";
import { env } from "~/env.mjs";
import { notFound } from "next/navigation";
import { Announcements } from "~/components/Announcements";
import Link from "next/link";
import { largeIcons } from "~/data/icons";
import { LinkText } from "~/components/LinkText";
import { TabelDateIstoriceScoala } from "~/components/tables/TabelDateIstoriceScoala";
import { ierarhieScoli } from "~/data/ierarhie";

export function generateStaticParams() {
  return query.scoliCuElevi.map((scoala) => ({
    id: scoala.id_scoala,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const numeScoala = query.scoli.find(
    (e) => e.id_scoala == params.id
  )?.nume_afisat;

  if (!numeScoala) return {};

  const title = `${numeScoala}`;
  const description = `Vezi informații detaliate despre ${numeScoala}, bazate pe rezultatele oficiale de la examenul de Evaluare Națională publicate de Ministerul Educației Naționale.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Bac Plus",
      images: ["/og-banner.jpg"],
      url: env.WEBSITE_URL,
    },
  };
}

export default function PaginaScoala({
  params: { id },
}: {
  params: { id: string };
}) {
  const { numeScoala, codJudet, rezultateEn, liceu, website, address } =
    getInfoScoala(id);

  const data = Object.entries(rezultateEn).at(-1);

  if (!data || !codJudet) notFound();

  return (
    <MainContainer>
      <div className="flex w-full flex-col items-center gap-32">
        <div className="mt-12 flex w-full flex-col items-center gap-8 ">
          {largeIcons[id] && (
            <img
              src={`/icons-lg/${id}.webp`}
              alt={numeScoala}
              className="mx-auto h-40 w-40"
            />
          )}

          <Title className="!my-0">{numeScoala}</Title>

          {(website || address) && (
            <div className="flex flex-col items-center gap-1">
              {website && (
                <LinkText href={website} target="_blank">
                  {new URL(website).hostname}
                </LinkText>
              )}
              {address && (
                <i className="w-[16rem] text-center [text-wrap:balance]">
                  {address}
                </i>
              )}
            </div>
          )}

          {liceu && (
            <div className="flex w-full justify-center gap-4 pb-2">
              <Link href={`/liceu/${id}`} replace={true} scroll={false}>
                <div className="border-black px-1 pb-2 text-center tracking-wide hover:border-b-2 hover:font-semibold hover:tracking-normal">
                  Liceu
                </div>
              </Link>
              <div className="border-collapse border-b-2 border-black px-1 pb-2 text-center font-semibold">
                Gimnaziu
              </div>
            </div>
          )}
        </div>

        <Announcements />

        <div className="mx-auto grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-4 sm:gap-x-16">
          <SnippetCard
            title={`Medie Evaluare ${data[0]}`}
            value={formtaNumber(data[1].medieEvaluareNationala, 2)}
          />
          <SnippetCard
            title={`Medie română ${data[0]}`}
            value={formtaNumber(data[1].medieLimbaRomana, 2)}
          />
          <SnippetCard
            title={`Medie matematică ${data[0]}`}
            value={formtaNumber(data[1].medieMatematica, 2)}
          />
          <SnippetCard
            title={`Absolvenți ${data[0]}`}
            value={formtaNumber(data[1].candidati, 0)}
          />
        </div>

        <TabelDateIstoriceScoala
          rezultateEn={rezultateEn}
          ierarhie={ierarhieScoli[id] ?? {}}
        />

        <div className="flex flex-col items-center">
          <ChartCard title={`Limbi materne ${data[0]}`}>
            <PieChart
              data={Object.entries(data[1].limbiMaterne).map(([limba, e]) => ({
                name: limba,
                value: e.candidati,
              }))}
            />
          </ChartCard>
        </div>
      </div>
    </MainContainer>
  );
}

function getInfoScoala(id: string) {
  const codJudet = query.en.find((result) => result.id_scoala == id)?.id_judet;
  const { nume_afisat: numeScoala } =
    query.scoli.find((result) => result.id_scoala == id) || {};

  const liceu = query.licee.find((result) => result.id_liceu == id);

  const rezultateEn = {} as {
    [an: number]: {
      medieEvaluareNationala?: number;
      medieLimbaRomana?: number;
      medieMatematica?: number;
      medieLimbaMaterna?: number;
      medieAbsolvire?: number;
      candidati: number;
      limbiMaterne: {
        [limba: string]: {
          candidati: number;
        };
      };
    };
  };

  query.en.forEach((result) => {
    if (result.id_scoala != id) return;

    rezultateEn[result.an] = {
      medieEvaluareNationala: result._avg.medie_en ?? undefined,
      medieLimbaRomana: result._avg.lr_final ?? undefined,
      medieMatematica: result._avg.ma_final ?? undefined,
      medieLimbaMaterna: result._avg.lm_final ?? undefined,
      medieAbsolvire: result._avg.medie_abs ?? undefined,
      candidati: result._count._all,
      limbiMaterne: {},
    };
  });

  query.limbiMaterneEn.forEach((result) => {
    if (result.id_scoala != id) return;

    const obj = rezultateEn[result.an];
    if (obj != undefined) {
      obj.limbiMaterne[result.limba_materna || "Limba română"] = {
        candidati: result._count._all,
      };
    }
  });

  return {
    liceu: liceu != undefined,
    rezultateEn,
    codJudet,
    numeScoala,
    website: liceu?.website,
    address: liceu?.address,
  };
}
