import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../index";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { posts, likes } from "../../db";
import { eq, desc, and, sql, inArray } from "drizzle-orm";

export const postsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const postsList = await ctx.db.query.posts.findMany({
        limit: input.limit,
        offset: input.offset,
        orderBy: [desc(posts.createdAt)],
        where: eq(posts.isPublished, true),
        with: {
          author: {
            columns: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      });

      let postsWithLikes = postsList;

      if (ctx.user && postsList.length > 0) {
        const postIds = postsList.map((p) => p.id);

        const userLikes = await ctx.db.query.likes.findMany({
          where: and(
            eq(likes.userId, ctx.user.id),
            inArray(likes.postId, postIds)
          ),
        });

        const likedPostIds = new Set(userLikes.map((l) => l.postId));
        postsWithLikes = postsList.map((post) => ({
          ...post,
          isLikedByUser: likedPostIds.has(post.id),
        }));
      } else {
        postsWithLikes = postsList.map((post) => ({
          ...post,
          isLikedByUser: false,
        }));
      }

      return postsWithLikes;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          author: {
            columns: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      let isLikedByUser = false;
      if (ctx.user) {
        const like = await ctx.db.query.likes.findFirst({
          where: and(eq(likes.userId, ctx.user.id), eq(likes.postId, post.id)),
        });
        isLikedByUser = !!like;
      }

      return {
        ...post,
        isLikedByUser,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        imageUrl: z.string().url().optional(),
        isPublished: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [post] = await ctx.db
        .insert(posts)
        .values({
          userId: ctx.user.id,
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl,
          isPublished: input.isPublished,
        })
        .returning();

      return post;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(255).optional(),
        content: z.string().min(1).optional(),
        imageUrl: z.string().url().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (post.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own posts",
        });
      }

      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, input.id))
        .returning();

      return updatedPost;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (post.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own posts",
        });
      }

      await ctx.db.delete(posts).where(eq(posts.id, input.id));

      return { success: true };
    }),

  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.postId),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const existingLike = await ctx.db.query.likes.findFirst({
        where: and(
          eq(likes.userId, ctx.user.id),
          eq(likes.postId, input.postId)
        ),
      });

      if (existingLike) {
        // Unlike
        await ctx.db.delete(likes).where(eq(likes.id, existingLike.id));
        await ctx.db
          .update(posts)
          .set({ likesCount: sql`${posts.likesCount} - 1` })
          .where(eq(posts.id, input.postId));

        return { liked: false, likesCount: post.likesCount - 1 };
      } else {
        // Like
        await ctx.db.insert(likes).values({
          userId: ctx.user.id,
          postId: input.postId,
        });
        await ctx.db
          .update(posts)
          .set({ likesCount: sql`${posts.likesCount} + 1` })
          .where(eq(posts.id, input.postId));

        return { liked: true, likesCount: post.likesCount + 1 };
      }
    }),

  myPosts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const myPosts = await ctx.db.query.posts.findMany({
        where: eq(posts.userId, ctx.user.id),
        limit: input.limit,
        offset: input.offset,
        orderBy: [desc(posts.createdAt)],
      });

      return myPosts;
    }),
});
