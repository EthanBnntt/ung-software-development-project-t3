// src/server/api/routers/review.ts
import { z } from 'zod';
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";
import {
    getReviewsByISBN,
    getReviewsByGenreNames,
    addReview,
    getAllReviews
} from '~/services/reviewService';

export const reviewRouter = createTRPCRouter({
    getReviewsByISBN: publicProcedure
        .input(z.object({ isbn: z.string() }))
        .query(async ({ input }) => {
            return await getReviewsByISBN(input.isbn);
        }),
    
    getReviewsByGenreNames: publicProcedure
        .input(z.object({
            genreNames: z.array(z.string()),
            minAge: z.number().max(100).optional(),
            maxAge: z.number().max(100).optional(),
        }))
        .query(async ({ input }) => {
            return await getReviewsByGenreNames(input.genreNames, input.minAge ?? 0, input.maxAge ?? 100);
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