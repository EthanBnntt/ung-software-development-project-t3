import { z } from 'zod';
import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { hash } from 'bcryptjs';
import { db } from '~/server/db';

export const userRouter = createTRPCRouter({
    signup: publicProcedure
        .input(z.object({ email: z.string().email(), password: z.string().min(8) }))
        .mutation(async ({ input }) => {
            const existingUser = await db.user.findUnique({
                where: { email: input.email },
            });

            if (existingUser)
                throw new Error('That email has already been used');

            const hashedPassword = await hash(input.password, 10);
            const user = await db.user.create({
                data: {
                    email: input.email,
                    password: hashedPassword,
                },
            });

            return user;
        }),
});