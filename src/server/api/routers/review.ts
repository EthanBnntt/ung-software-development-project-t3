// src/server/api/routers/review.ts
import { z } from 'zod';
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";
import {
    getReviewsByISBN,
    addReview,
    getAllReviews
} from '~/services/reviewService';

export const reviewRouter = createTRPCRouter({
    getReviewsByISBN: publicProcedure
        .input(z.object({ isbn: z.string() }))
        .query(async ({ input }) => {
            return await getReviewsByISBN(input.isbn);
        }),

    addReview: protectedProcedure
        .input(z.object({
            isbn: z.string(),
            content: z.string(),
            rating: z.number().min(1).max(5),
            //userId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session?.user.id;
            if (!userId) {
                throw new Error('User not found');
            }

            return await addReview(input.isbn, input.content, input.rating, userId);
        }),

    getAllReviews: publicProcedure
        .query(async () => {
            return await getAllReviews();
        }),
});