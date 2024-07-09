// server/routers/userRouter.ts
import { z } from 'zod';
import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

import { 
    getAllBooks,
    getBookByISBN,
    getBooksByGenreName,
    getTrendingBooks,
    getNewBooks,
    getBooksByAuthorName,
 } from '~/services/bookService';

export const bookRouter = createTRPCRouter({    
    getAllBooks: publicProcedure
        .query(async () => {
            return await getAllBooks();
        }),
    
    getBookByISBN: publicProcedure
        .input(z.object({ isbn: z.string() }))
        .query(({ input }) => {
            return getBookByISBN(input.isbn);
        }),
    
    getBooksByGenreName: publicProcedure
        .input(z.object({ genreName: z.string() }))
        .query(async ({ input }) => {
            return await getBooksByGenreName(input.genreName);
        }),

    getTrendingBooks: publicProcedure
        .query(async () => {
            return await getTrendingBooks();
        }),
    
    getNewBooks: publicProcedure
        .query(async () => {
            return await getNewBooks();
        }),

    getBooksByAuthorName: publicProcedure
        .input(z.object({ authorName: z.string() }))
        .query(async ({ input }) => {
            return await getBooksByAuthorName(input.authorName);
        }),
});