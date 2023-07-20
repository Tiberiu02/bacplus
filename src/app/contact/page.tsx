import { Navbar } from "@/components/Navbar";

export default function contact() {
  return (
    <>
      <div className="block xl:max-w-6xl w-full mx-auto px-3">
        <h1 className="mt-5 font-semibold text-4xl mt-12 mb-4">Contact</h1>
        <hr className="my-4" />
        <p className="mb-4">
          Pentru sugestii, idei, probleme cu platforma, sau orice altceva ne
          puteți contacta prin e-mail la adresa{" "}
          <b>
            <i>contact@bacplus.ro.</i>
          </b>
        </p>
        <p className="mb-4">Orice feedback este binevenit!</p>
        <h1 className="mt-5 font-semibold text-4xl mt-12 mb-4">Autori</h1>

        <hr className="my-4" />
        <p className="mb-4">La acest proiect au lucrat:</p>
        <ul className="list-disc pl-10 mb-2">
          <li>
            <a
              href="https://people.epfl.ch/tiberiu.musat"
              className="hover:underline hover:text-blue-600 text-blue-400"
            >
              Tiberiu Mușat
            </a>
          </li>
          <li>
            <a
              href="http://mircea.rebengiuc.com/"
              className="hover:underline hover:text-blue-600  text-blue-400"
            >
              Mircea Rebengiuc
            </a>
          </li>
        </ul>
        <h1 className="mt-5 font-semibold text-4xl mt-12 mb-4">Cod sursă</h1>
        <hr className="my-4" />
        <p className="mb-4">
          Tot codul sursă din spatele acestui proiect este disponibil public și
          acceptă contribuții pe GitHub:
        </p>
      </div>
    </>
  );
}
