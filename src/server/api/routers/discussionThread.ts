// server/routers/userRouter.ts
import { z } from 'zod';
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";

import { createThread, getThreadsByBookISBN } from "~/services/discussionThreadService";

export const discussionThreadRouter = createTRPCRouter({
    createDiscussionThread: protectedProcedure
        .input(z.object({
            title: z.string(),
            bookISBN: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            // Get the user id
            const userId = ctx.session.user.id;

            const thread = await createThread(input.title, input.bookISBN, userId);

            return thread;
        }),
    
    getThreadsByBookISBN: publicProcedure
        .input(z.object({
            bookISBN: z.string(),
        }))
        .query(async ({ input }) => {
            return await getThreadsByBookISBN(input.bookISBN);
        }),
});