import { Authors } from "~/components/Authors";
import { LinkText } from "~/components/LinkText";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import { env } from "~/env.mjs";

export default function contact() {
  return (
    <>
      <MainContainer>
        <Title>Despre</Title>
        <p>
          Toate datele de pe acest site au fost sintetizate folosind informații
          publicate de Ministerul Educației Naționale pe{" "}
          <LinkText
            target="_blank"
            href="http://static.bacalaureat.edu.ro/2023/"
          >
            bacalaureat.edu.ro
          </LinkText>
          ,{" "}
          <LinkText
            target="_blank"
            href="https://data.gov.ro/en/organization/men"
          >
            data.gov.ro
          </LinkText>
          ,{" "}
          <LinkText target="_blank" href="http://static.admitere.edu.ro/">
            admitere.edu.ro
          </LinkText>
          {" și "}
          <LinkText target="_blank" href="http://static.evaluare.edu.ro/">
            evaluare.edu.ro.
          </LinkText>
        </p>
        <p>
          În vederea realizării tuturor statisticilor de pe acest site, am creat
          o baza de date unificată cu toate datele disponibile pe site-urile
          menționate mai sus. Rămânând fideli misiunii noastre de a spori
          transparența în sistemul educațional românesc, am decis să facem
          publică această bază de date. Aceasta este disponibilă în formatul
          SQLite și poate fi descărcată de{" "}
          <LinkText href={env.DB_DOWNLOAD_URL} target="_blank">
            aici
          </LinkText>
          . Pentru a putea lucra cu această bază de date, vă recomandăm
          programul gratuit{" "}
          <LinkText href="https://sqlitestudio.pl/" target="_blank">
            SQLiteStudio
          </LinkText>
          . Va fi nevoie să cunoașteți limbajul de interogare a bazelor de date
          SQL (Standard Query Language). Vă recomandăm{" "}
          <LinkText href="https://www.w3schools.com/sql" target="_blank">
            acest tutorial SQL gratuit
          </LinkText>
          .
        </p>
        <p>
          De asemenea, facem publice programele create de noi pentru a descărca
          rezultatele și a crea această bază de date unificată. Le puteți accesa
          pe GitHub{" "}
          <LinkText
            href="https://github.com/Tiberiu02/bacplus-data"
            target="_blank"
          >
            aici
          </LinkText>
          .
        </p>

        <Title>Contact</Title>
        <p>
          Pentru sugestii, idei, probleme cu platforma, sau orice altceva, ne
          puteți contacta prin e-mail la adresa{" "}
          <b>
            <i>contact@bacplus.ro.</i>
          </b>
        </p>
        <p>Orice feedback este binevenit!</p>
        <Authors />
      </MainContainer>
    </>
  );
}
