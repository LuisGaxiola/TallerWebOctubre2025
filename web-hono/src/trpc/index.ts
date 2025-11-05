import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware for authentication
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Middleware for admin role
const isAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Middleware for moderator or admin role
const isModerator = t.middleware(async ({ ctx, next }) => {
  if (
    !ctx.user ||
    (ctx.user.role !== "admin" && ctx.user.role !== "moderator")
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Moderator access required",
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
export const adminProcedure = t.procedure.use(isAuthenticated).use(isAdmin);
export const moderatorProcedure = t.procedure
  .use(isAuthenticated)
  .use(isModerator);
