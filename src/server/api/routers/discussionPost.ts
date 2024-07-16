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

import {
    createDiscussionPost,
    getDiscussionPostsByThreadId,
} from "~/services/discussionPostService";

export const discussionPostRouter = createTRPCRouter({
    createDiscussionPost: protectedProcedure
        .input(z.object({
            content: z.string(),
            threadId: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
            // Get the user id
            const userId = ctx.session.user.id;

            if (!userId) {
                throw new Error("User not logged in");
            }

            return await createDiscussionPost(input.threadId, input.content, userId);
        }),
    
    getDiscussionPostsByThreadId: publicProcedure
        .input(z.object({
            threadId: z.number(),
        }))
        .query(async ({ input }) => {
            return await getDiscussionPostsByThreadId(input.threadId);
        }),
});