import { FaDotCircle, FaExternalLinkAlt } from "react-icons/fa";
import { CopyButton } from "~/components/CopyButton";
import { Footer } from "~/components/Footer";
import { LinkText } from "~/components/LinkText";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import { judetDupaCod } from "~/data/coduriJudete";
import { query, ultimulAnBac } from "~/data/dbQuery";
import { ierarhieLicee } from "~/data/ierarhie";

export default function Page() {
  const numLargeIcons = query.institutii.filter((i) => i.sigla_lg).length;
  const numSmallIcons = query.institutii.filter((i) => i.sigla_xs).length;

  return (
    <MainContainer>
      <Title>Ghid adăugare sigle</Title>

      <ol className="[&>li]:list-decimal">
        <li className="">
          Exista două moduri de a găsi sigla liceului, pe Google Images sau pe
          site-ul liceului
          <ol type="a" className="ml-8 [&>li]:list-[lower-alpha]">
            <li>
              Caută pe Google &quot;nume liceu sigla&quot; sau &quot;nume liceu
              logo&quot;
            </li>
            <li>
              Deschide site-ul liceului pentru a vedea dacă există vreo sigla
              acolo
            </li>
          </ol>
        </li>
        <li>
          Trebuie să cauți o siglă care:
          <ol type="a" className="ml-8 [&>li]:list-[lower-alpha]">
            <li>
              Este sigla oficială a liceului și reprezintă identitatea liceului
            </li>
            <li>
              Are o rezoluție cât mai bună (minim 100x100 pixeli, preferabil
              peste 300x300)
            </li>
            <li>
              Are o calitate cât mai bună (nu este blurată și nu are artefacte
              de compresie)
            </li>
            <li>Preferabil cu fundal transparent</li>
            <li>Este perfect incadrată în imagine (nu are margini goale)</li>
          </ol>
        </li>
        <li>
          De multe ori Google Images nu îți arată imaginea la rezoluție
          completă. Deschide site-ul sursă și preia sigla de acolo
        </li>
        <li>
          Siglele trebuie salvate in folderul &quot;data/icons&quot; cu numele
          fiind ID-ul liceului de pe BacPlus, de exemplu
          COLEGIUL_NATIONAL_DE_INFORMATICA_TUDOR_VIANU_B.png
        </li>
        <li>
          Dacă ai găsit sigla exact așa cum trebuie, salveaz-o cu numele bun și
          mut-o in folder
        </li>
        <li>
          Dacă ai găsit o siglă care necesită ajustări, copiaz-o (click dreapta
          &gt; copy image) și pune-o în GIMP (după ce ai deschis GIMP, apasă
          File &gt; Create &gt; From clipboard, sau Ctrl+Shift+V)
          <ol type="a" className="ml-8 [&>li]:list-[lower-alpha]">
            <li>
              Dacă sigla trebuie încadrată, selectează perfect sigla cu ajutorul
              Selecției apoi apasă Image &gt; Crop to selection
            </li>
            <li>
              Dacă imaginea conține text sau elemente care nu fac parte din
              siglă, le poți elimina folosind Guma sau Creionul (ajustează Size
              și Hardness)
            </li>
            <li>
              Salvează sigla folosind File &gt; Export as (sau Ctrl+Shift+E) cu
              numele bun în folderul bun
            </li>
          </ol>
        </li>
        <li>
          Dacă sigla pe care ai adăugat-o înlocuiește o siglă mai proastă,
          asigură-te că ai șters sigla veche
        </li>
      </ol>

      <Title className="mt-32">Sigle lipsă</Title>
      <p>
        <FaDotCircle className="mr-2 mt-[-2px] inline text-green-500" />
        <b>{numLargeIcons}</b> instituții au sigle
      </p>
      <p>
        <FaDotCircle className="mr-2 mt-[-2px] inline text-orange-500" />
        <b>{numSmallIcons - numLargeIcons}</b> instituții au sigle prea mici
      </p>
      <p>
        <FaDotCircle className="mr-2 mt-[-2px] inline text-red-500" />
        <b>{query.institutii.length - numSmallIcons}</b> instituții nu au deloc
        siglă
      </p>

      <div className="mt-12 flex flex-col gap-16">
        {[...query.institutii]
          .sort(
            (a, b) =>
              (ierarhieLicee[a.cod_siiir]?.[ultimulAnBac] || 1e9) -
              (ierarhieLicee[b.cod_siiir]?.[ultimulAnBac] || 1e9)
          )
          .filter((i) => !i.sigla_lg)
          .slice(0, 500)
          .map((i) => {
            const judet = judetDupaCod(i.cod_judet);

            return i.sigla_lg ? null : (
              <div key={i.cod_siiir} className="flex flex-col">
                <div className="font-semibold">
                  {ierarhieLicee[i.cod_siiir]?.[ultimulAnBac] || "?"}. {i.nume}{" "}
                  <span className="font-normal">({judet.numeIntreg})</span>
                  {i.sigla_xs ? (
                    <div className="ml-4 inline font-medium text-orange-500">
                      <FaDotCircle className="mr-2 mt-[-2px] inline" />
                      Siglă prea mică
                    </div>
                  ) : (
                    <div className="ml-4 inline font-medium text-red-500">
                      <FaDotCircle className="mr-2 mt-[-2px] inline" />
                      Fără siglă
                    </div>
                  )}
                </div>
                {/* <div className="my-2">
                  Salvează sigla cu numele:{" "}
                  <span className="font-medium">{i.id}</span>
                  <CopyButton text={i.id} />
                </div> */}
                <LinkText
                  href={
                    "https://google.com/search?tbm=isch&q=" +
                    encodeURIComponent(
                      i.nume + " " + judet.numeIntreg + " sigla"
                    )
                  }
                  target="_blank"
                >
                  <FaExternalLinkAlt className="mr-2 mt-[-2px] inline" />
                  Caută siglă pe Google
                </LinkText>
                {i.website && (
                  <LinkText href={i.website} target="_blank">
                    <FaExternalLinkAlt className="mr-2 mt-[-2px] inline" />
                    {i.website.replace(/https?:\/\//, "").replace(/\/$/, "")}
                  </LinkText>
                )}
              </div>
            );
          })}
      </div>
      <Footer />
    </MainContainer>
  );
}
