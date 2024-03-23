import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/app";
import { userDataStorageKey } from "~/app/admin/userData";

function getAuthToken() {
  let token = "";

  try {
    const userData = JSON.parse(
      localStorage.getItem(userDataStorageKey) || ""
    ) as {
      token: string;
    };
    token = "Bearer " + userData.token;
  } catch (e) {}

  return token;
}

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config(_opts) {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/v11/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,

          // You can pass any HTTP headers you wish here
          headers() {
            return {
              authorization: getAuthToken(),
            };
          },
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/v11/ssr
   **/
  ssr: false,
});
