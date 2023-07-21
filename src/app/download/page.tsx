import { Title } from "~/components/Title";
import { LinkText } from "~/components/LinkText";
import { MainContainer } from "~/components/MainContainer";
// https://drive.google.com/file/d/15PT8P9VYKyab2fpxMmejyhFlHiyWTJR2/view?usp=sharing
// https://sqlitestudio.pl/

export default function Download() {
  return (
    <>
      <MainContainer>
        <Title>Download</Title>
        <p className="m4">
          Toate datele de pe acest site au fost sintetizate folosind informații
          publicate de Ministerul Educației pe{" "}
          <LinkText href="http://static.bacalaureat.edu.ro/2023/">
            bacalaureat.edu.ro
          </LinkText>{" "}
          sau pe{" "}
          <LinkText href="https://data.gov.ro/en/organization/men">
            data.gov.ro.
          </LinkText>
        </p>
        <p className="mb-4">
          Rămânând fideli misiunii noastre de a spori transparența examenului de
          bacalaureat, publicăm toate datele sintetizate de noi sub licența{" "}
          <LinkText href="https://bacplus.ro/assets/licenta/odc_by_1.0_public_text.txt">
            Open Data Commons Attribution
          </LinkText>
          . Cu alte cuvinte, oricine poate descărca, prelucra și distribui
          datele noastre cu condiția de a menționa sursa.
        </p>
        <p className="mb-4">
          De asemenea, facem publice programele create de noi pentru a decărca
          rezultatele la bac și a sintetiza statisticile. Le puteți accesa{" "}
          <LinkText href="https://github.com/Tiberiu02/bacplus-data">
            aici
          </LinkText>
          .
        </p>
        <p className="mb-4">
          Arhiva cu toate datele disponibile pe acest site se poate descarca{" "}
          <LinkText href="https://drive.google.com/file/d/15PT8P9VYKyab2fpxMmejyhFlHiyWTJR2/view?usp=sharing">
            aici
          </LinkText>
          . Aceasta este disponibilă in forma unei baze de date și poate fi
          vizualizată utilizând programul{" "}
          <LinkText href="https://sqlitestudio.pl/">SQLiteStudio</LinkText>
        </p>
      </MainContainer>
    </>
  );
}
