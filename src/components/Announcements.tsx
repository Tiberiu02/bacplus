import { BsFillSuitHeartFill } from "react-icons/bs";
import { LinkText } from "./LinkText";

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
              <LinkText
                href="https://acceptromania.ro/petitie/"
                target="_blank"
              >
                petiția
              </LinkText>{" "}
              pentru protejarea tuturor familiilor sau exprimă-ți susținerea pe{" "}
              <LinkText href="https://FiiAliat.ro" target="_blank">
                FiiAliat.ro
              </LinkText>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
