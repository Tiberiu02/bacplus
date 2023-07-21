import { LinkText } from "~/components/LinkText";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";

export default function contact() {
  return (
    <>
      <MainContainer>
        <Title>Contact</Title>
        <p>
          Pentru sugestii, idei, probleme cu platforma, sau orice altceva ne
          puteți contacta prin e-mail la adresa{" "}
          <b>
            <i>contact@bacplus.ro.</i>
          </b>
        </p>
        <p>Orice feedback este binevenit!</p>
        <Title>Autori</Title>
        <p>La acest proiect au lucradasdst:</p>
        <ul className="mb-2 list-disc pl-10">
          <li>
            <LinkText href="https://people.epfl.ch/tiberiu.musat">
              Tiberiu Mușat
            </LinkText>
          </li>
          <li>
            <LinkText href="http://mircea.rebengiuc.com/">
              Mircea Rebengiuc
            </LinkText>
          </li>
        </ul>
        <Title>Cod sursă</Title>
        <p>
          Tot codul sursă din spatele acestui proiect este disponibil public și
          acceptă contribuții pe GitHub:
        </p>
      </MainContainer>
    </>
  );
}
