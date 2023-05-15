import Link from "next/link";

export default function LinkButton({ children, href }: { children: string, href?: string } ) {
  return (
    <Link
      className="text-xl text-blue-500 rounded-md hover:bg-blue-500 hover:text-white px-4 py-2 border-2 border-blue-500 transition duration-200"
      href={href ? href : '/'}
    >
      {children}
    </Link>
  );
}
