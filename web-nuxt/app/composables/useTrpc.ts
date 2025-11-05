import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "~/../../web-hono/src/trpc/routers";
import superjson from "superjson";

export const useTrpc = () => {
  const config = useRuntimeConfig();
  const token = useCookie("auth_token");

  const client = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${config.public.apiUrl}/trpc`,
        headers() {
          return {
            authorization: token.value ? `Bearer ${token.value}` : "",
          };
        },
        transformer: superjson,
      }),
    ],
  });

  return client;
};
