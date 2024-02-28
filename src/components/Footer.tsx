import { CurrentYear } from "./CurrentYear";

export function Footer() {
  return (
    <div className="mt-auto">
      <div className="mt-24 w-full p-3 text-center">
        © <CurrentYear />{" "}
        <a href="https://bacplus.ro/" className="hover:underline">
          BacPlus.ro
        </a>
      </div>
    </div>
  );
}
