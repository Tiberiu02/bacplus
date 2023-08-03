import Link from "next/link";
import { BsFillSuitHeartFill } from "react-icons/bs";

export function Announcements() {
  const showLGBT = Date.now() < new Date("10/01/2023").getTime();

  return (
    <>
      {showLGBT && (
        <div className="flex items-center gap-3 rounded bg-green-100 px-3 py-3 shadow sm:px-4">
          <BsFillSuitHeartFill className="shrink-0 text-3xl text-green-700" />
          <div className="text-green-700">
            <span className="font-bold">
              Spune STOP discriminării în România!
            </span>{" "}
            Semnează{" "}
            <Link
              href="https://acceptromania.ro/petitie/"
              target="_blank"
              className="font-semibold italic text-blue-600 hover:underline"
            >
              petiția
            </Link>{" "}
            pentru protejarea tuturor familiilor sau exprimă-ți susținerea pe{" "}
            <Link
              href="https://FiiAliat.ro"
              target="_blank"
              className="font-semibold italic text-blue-600 hover:underline"
            >
              FiiAliat.ro
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
