// server/routers/userRouter.ts
import { access } from 'fs';
import { z } from 'zod';
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { 
    getCommunitiesByGenreNames,
    getCommunityById,
    createCommunity,
    accessCommunity
} from '~/services/communityService';

export const communityRouter = createTRPCRouter({
    getCommunityById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const community = await getCommunityById(input.id);

            if (!community)
                throw new Error('Community not found');

            return community;
        }),

    getCommunitiesByGenreNames: publicProcedure
        .input(z.object({ genreNames: z.array(z.string()) }))
        .query(async ({ input }) => {
            return await getCommunitiesByGenreNames(input.genreNames);
        }),
    
    createCommunity: publicProcedure
        .input(z.object({
            name: z.string(),
            genreNames: z.array(z.string()),
            accessCode: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.session || !ctx.session.user || !ctx.session.user.id)
                throw new Error('User not logged in');

            const userId = ctx.session.user.id;

            return await createCommunity(input.name, input.genreNames, userId, input.accessCode);
        }),
    
    accessCommunity: protectedProcedure
        .input(z.object({
            communityId: z.number(),
            accessCode: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.session || !ctx.session.user || !ctx.session.user.id)
                throw new Error('User not logged in');

            const userId = ctx.session.user.id;

            return await accessCommunity(input.communityId, userId, input.accessCode);
        }),
});