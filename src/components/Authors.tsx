import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa6";

export function Authors() {
  return (
    <div className="flex flex-wrap justify-evenly gap-6">
      <div className="mt-4 flex flex-col items-center">
        <img
          src="/tiberiu.jpg"
          className="max-w-[15rem] rounded-full shadow-lg"
        />
        <div className="mt-4 text-2xl font-bold">Tiberiu Mușat</div>
        <div className="text-center text-lg">Fondator</div>
        <div className="mt-3 flex gap-3">
          <a
            href="https://www.linkedin.com/in/tiberiu-musat/"
            target="_blank"
            className="opacity-50 transition-all duration-200 hover:scale-125"
          >
            <FaLinkedin className="text-2xl" />
          </a>
          <a
            href="https://github.com/Tiberiu02/"
            target="_blank"
            className="opacity-50 transition-all duration-200 hover:scale-125"
          >
            <FaGithub className="text-2xl" />
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <img
          src="/mircea.jpg"
          className="max-w-[15rem] rounded-full shadow-lg"
        />
        <div className="mt-4 text-2xl font-bold">Mircea Rebengiuc</div>
        <div className="text-center text-lg">Cofondator</div>
        <div className="mt-3 flex gap-3">
          <a
            href="http://mircea.rebengiuc.com/"
            target="_blank"
            className="opacity-50 transition-all duration-200 hover:scale-125"
          >
            <FaGlobe className="text-2xl" />
          </a>
          <a
            href="https://github.com/mircea007/"
            target="_blank"
            className="opacity-50 transition-all duration-200 hover:scale-125"
          >
            <FaGithub className="text-2xl" />
          </a>
        </div>
      </div>
    </div>
  );
}
