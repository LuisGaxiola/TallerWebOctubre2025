import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import jwt from "jsonwebtoken";
import { db, User } from "../db";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

export async function createContext({ req }: FetchCreateContextFnOptions) {
  const authHeader = req.headers.get("authorization");
  let user: User | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const users = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, decoded.userId),
      });
      user = users || null;
    } catch (error) {
      // Token invalid or expired
      console.error("Invalid token:", error);
    }
  }

  return {
    user,
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
