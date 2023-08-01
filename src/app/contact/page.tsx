import { Authors } from "~/components/Authors";
import { LinkText } from "~/components/LinkText";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";

export default function contact() {
  return (
    <>
      <MainContainer>
        <Title>Contact</Title>
        <p>
          Pentru sugestii, idei, probleme cu platforma, sau orice altceva, ne
          puteți contacta prin e-mail la adresa{" "}
          <b>
            <i>contact@bacplus.ro.</i>
          </b>
        </p>
        <p>Orice feedback este binevenit!</p>
        <Title>Autori</Title>
        <Authors />
      </MainContainer>
    </>
  );
}
