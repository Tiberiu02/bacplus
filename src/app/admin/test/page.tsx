"use client";

import { env } from "~/env.mjs";

import { trpc } from "~/utils/trpc";

export default function IndexPage() {
  const hello = trpc.test.useQuery();
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  console.log("node_env", env.NEXT_PUBLIC_TRPC_API_URL);
  return (
    <div>
      <p>{JSON.stringify(hello.data)}</p>
    </div>
  );
}
