import { postRouter } from "~/server/api/routers/post";
import { userRouter } from "~/server/api/routers/user";
import { bookRouter } from "~/server/api/routers/book";
import { discussionThreadRouter } from "~/server/api/routers/discussionThread";
import { reviewRouter } from "~/server/api/routers/review";
import { communityRouter } from "~/server/api/routers/community";
import { discussionPostRouter } from "~/server/api/routers/discussionPost";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  book: bookRouter,
  discussionThread: discussionThreadRouter,
  discussionPost: discussionPostRouter,
  review: reviewRouter,
  community: communityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
