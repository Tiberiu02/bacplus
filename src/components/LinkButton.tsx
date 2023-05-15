import Link from "next/link";
import { PropsWithChildren } from 'react'


export default function LinkButton( { children, href, className }: PropsWithChildren<{ href?: string, className?: string }> ) {
  return (
    <Link
      className={"text-xl text-blue-500 rounded-md hover:bg-blue-500 hover:text-white px-4 py-2 border-2 border-blue-500 transition duration-200 " + (className ? className : '')}
      href={href ? href : '/'}
    >
      {children}
    </Link>
  );
}
