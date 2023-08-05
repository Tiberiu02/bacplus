import Link from "next/link";
import { BsFillSuitHeartFill } from "react-icons/bs";

export function Announcements() {
  const showLGBT = Date.now() < new Date("10/01/2023").getTime();

  return (
    <>
      {showLGBT && (
        <div className="bg-lgbt mb-2 rounded-lg p-1">
          <div className="flex items-center gap-4 rounded bg-white bg-opacity-90 px-4 py-3 shadow sm:px-5">
            <div className="translate-y-[0.08rem] text-lg text-red-500 drop-shadow">
              <BsFillSuitHeartFill />
            </div>
            <div className="">
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
        </div>
      )}
    </>
  );
}
