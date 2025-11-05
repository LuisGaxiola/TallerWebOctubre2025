import { router } from "../index";
import { authRouter } from "./auth";
import { postsRouter } from "./posts";
import { usersRouter } from "./users";

export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
