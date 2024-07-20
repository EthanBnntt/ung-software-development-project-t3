import { z } from 'zod';
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

import {
    createThread,
    getThreadsByBookISBN,
    getThreadsByCommunityId
} from "~/services/discussionThreadService";

export const discussionThreadRouter = createTRPCRouter({
    createDiscussionThread: protectedProcedure
        .input(z.object({
            title: z.string(),
            communityId: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
            // Get the user id
            const userId = ctx.session.user.id;

            if (!userId) {
                throw new Error("User not logged in");
            }

            return await createThread(input.title, input.communityId, userId);
        }),
    
    getThreadsByBookISBN: publicProcedure
        .input(z.object({
            bookISBN: z.string(),
        }))
        .query(async ({ input }) => {
            return await getThreadsByBookISBN(input.bookISBN);
        }),

    getThreadsByCommunityId: publicProcedure
        .input(z.object({
            communityId: z.number(),
        }))
        .query(async ({ input }) => {
            return await getThreadsByCommunityId(input.communityId);
        }),
});