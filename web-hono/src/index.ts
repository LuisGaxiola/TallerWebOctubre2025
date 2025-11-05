import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/routers";
import { createContext } from "./trpc/context";

const app = new Hono();

// CORS middleware
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000", "http://localhost"],
    credentials: true,
  })
);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// tRPC handler
app.all("/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

const port = parseInt(process.env.PORT || "3001");

console.log(`🚀 Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
