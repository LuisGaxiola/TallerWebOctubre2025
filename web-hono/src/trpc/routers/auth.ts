import { router, publicProcedure, protectedProcedure } from "../index";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { users } from "../../db";
import { eq } from "drizzle-orm";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);

      try {
        const [user] = await ctx.db
          .insert(users)
          .values({
            username: input.username,
            email: input.email,
            password: hashedPassword,
            firstName: input.firstName,
            lastName: input.lastName,
            role: "user",
          })
          .returning();

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          token,
        };
      } catch (error: any) {
        if (error.code === "23505") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username or email already exists",
          });
        }
        throw error;
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.username, input.username),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const validPassword = await bcrypt.compare(input.password, user.password);

      if (!validPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      if (!user.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Account is deactivated",
        });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
        },
        token,
      };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return {
      id: ctx.user.id,
      username: ctx.user.username,
      email: ctx.user.email,
      role: ctx.user.role,
      firstName: ctx.user.firstName,
      lastName: ctx.user.lastName,
      bio: ctx.user.bio,
      avatarUrl: ctx.user.avatarUrl,
    };
  }),
});
