import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../index";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { users } from "../../db";
import { eq } from "drizzle-orm";

export const usersRouter = router({
  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const usersList = await ctx.db.query.users.findMany({
        limit: input.limit,
        offset: input.offset,
        columns: {
          password: false,
        },
      });

      return usersList;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        columns: {
          password: false,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().max(100).optional(),
        lastName: z.string().max(100).optional(),
        bio: z.string().max(500).optional(),
        avatarUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [updatedUser] = await ctx.db
        .update(users)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl,
      };
    }),

  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        role: z.enum(["admin", "moderator", "user"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [updatedUser] = await ctx.db
        .update(users)
        .set({
          role: input.role,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId))
        .returning();

      return updatedUser;
    }),

  toggleActive: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const [updatedUser] = await ctx.db
        .update(users)
        .set({
          isActive: !user.isActive,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId))
        .returning();

      return updatedUser;
    }),
});
