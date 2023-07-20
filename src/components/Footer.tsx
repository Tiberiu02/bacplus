export function Footer() {
  let currentYear = new Date().getFullYear();
  return (
    <div className="mt-auto">
      <div className="w-full bg-gray-200 text-center p-4 mt-4">
        {" "}
        © {currentYear} Copyright:{" "}
        <a href="https://bacplus.ro/" className="hover:underline">
          BacPlus.ro
        </a>
      </div>
    </div>
  );
}
