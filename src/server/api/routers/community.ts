// server/routers/userRouter.ts
import { z } from 'zod';
import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

import { 
    getCommunitiesByGenreNames,
    getCommunityById,
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
});